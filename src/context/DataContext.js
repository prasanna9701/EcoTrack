import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateCarbonReport } from '../utils/carbonLogicEngine';
import { supabase } from '../pages/supabaseClient';
import { getPriorityExtraction, buildUtilityItemFromSample } from '../utils/extractionLogic';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [utilityData, setUtilityData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalEmissions, setGlobalEmissions] = useState({ totalMT: 0, requiredCredits: 0 });
  const [electricBizId, setElectricBizId] = useState(null);
  const [gasBizId, setGasBizId] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadUtilityData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) {
        setIsHydrated(true);
        return;
      }

      const { data, error } = await supabase
        .from('user_utility_data')
        .select('payload')
        .eq('user_id', userId)
        .single();

      if (!error && Array.isArray(data?.payload)) {
        setUtilityData(data.payload);
      }

      setIsHydrated(true);
    };

    loadUtilityData();
  }, []);

  useEffect(() => {
    const persistUtilityData = async () => {
      if (!isHydrated) return;

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) return;

      await supabase
        .from('user_utility_data')
        .upsert(
          {
            user_id: userId,
            payload: utilityData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
    };

    persistUtilityData();
  }, [utilityData, isHydrated]);

  const updateIdentityAnchor = (sample) => {
    if (!sample) return;
    if (sample.type === 'ELECTRICITY') setElectricBizId(sample.id);
    if (sample.type === 'GAS') setGasBizId(sample.id);
  };

  const appendSampleFileData = (fileName) => {
    const sample = getPriorityExtraction(fileName);
    if (!sample) return null;

    const itemPayload = buildUtilityItemFromSample(sample, { sourceFileName: fileName });
    const missingFields = [];
    const isHighVariance = false;
    const completePayload = {
      ...itemPayload,
      missingFields,
      isHighVariance,
      isEdited: false,
    };

    setUtilityData(prev => [...prev, completePayload]);
    updateIdentityAnchor(sample);
    return completePayload;
  };

  // Recalculate global emissions whenever utilityData changes
  useEffect(() => {
    let scope1Vol = 0;
    let scope2kWh = 0;

    utilityData.forEach(item => {
      // Ignore items with critical missing data or unconfirmed outliers until approved
      if (item.missingFields?.length > 0) return;

      if (item.type === 'Gas') {
        let val = item.value;
        if (item.unit === 'm3') val = val * 0.353147; // Auto unit conversion to therms
        scope1Vol += val;
      } else if (item.type === 'Electricity') {
        scope2kWh += item.value;
      }
    });

    const mockPayload = {};
    if (scope1Vol > 0) mockPayload.scope1 = { volume: scope1Vol, unit: 'therms' };
    if (scope2kWh > 0) mockPayload.scope2 = { kWh: scope2kWh, region: 'india' };

    const report = generateCarbonReport(mockPayload);
    setGlobalEmissions(report);
  }, [utilityData]);

  const checkDuplicate = (provider, billingPeriod) => {
    return utilityData.find(
      (item) => item.provider.toLowerCase() === provider.toLowerCase() && item.billingPeriod === billingPeriod
    );
  };

  const getThreeMonthAvg = (type) => {
    const historical = utilityData.filter(item => item.type === type && !item.isOutlier);
    if (historical.length === 0) return null;
    const recent = historical.slice(-3); // Get last 3
    const sum = recent.reduce((acc, curr) => acc + curr.value, 0);
    return sum / recent.length;
  };

  const addOrUpdateData = (newData) => {
    const fileName = newData.sourceFileName || newData.fileName || '';
    const sample = fileName ? getPriorityExtraction(fileName) : null;
    let incomingData = { ...newData };

    if (sample) {
      const samplePayload = buildUtilityItemFromSample(sample, {
        id: newData.id,
        sourceFileName: fileName,
      });
      incomingData = { ...incomingData, ...samplePayload };
      updateIdentityAnchor(sample);
    }

    // Check missing fields for Partial Extraction (Date, Value, Provider)
    const missingFields = [];
    if (!incomingData.billingPeriod) missingFields.push('Billing Date');
    if (!incomingData.value && incomingData.value !== 0) missingFields.push('Usage Value');
    if (!incomingData.provider) missingFields.push('Provider');

    let isHighVariance = false;
    if (incomingData.value) {
      const avg = getThreeMonthAvg(incomingData.type);
      if (avg !== null && React.isValidElement) {
        const variance = Math.abs(incomingData.value - avg) / avg;
        if (variance > 0.5) isHighVariance = true;
      }
    }

    const itemPayload = {
      id: incomingData.id || Date.now().toString(),
      ...incomingData,
      missingFields,
      isHighVariance,
      isEdited: incomingData.isEdited || false,
    };

    setUtilityData(prev => {
      // If updating existing
      const existingIndex = prev.findIndex(item => item.id === newData.id);
      if (existingIndex !== -1) {
        return prev.map(item => item.id === newData.id ? { ...item, ...itemPayload, id: item.id } : item);
      }
      return [...prev, itemPayload];
    });

    return itemPayload;
  };

  const deleteData = (id) => {
    setUtilityData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DataContext.Provider value={{
      utilityData,
      isProcessing,
      setIsProcessing,
      globalEmissions,
      electricBizId,
      gasBizId,
      addOrUpdateData,
      appendSampleFileData,
      checkDuplicate,
      deleteData,
      setUtilityData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
