import React, { useState, useRef } from "react";
import { useDataContext } from "../context/DataContext";
import { FaCloudUploadAlt, FaEdit, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const pageStyles = {
  minHeight: "100vh",
  display: "flex",
  background: "#ffffff",
  color: "#0f172a",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const mainStyles = {
  flex: 1,
  padding: "24px",
  boxSizing: "border-box",
};

const dropZoneStyles = {
  border: "2px dashed rgba(74, 222, 128, 0.5)",
  borderRadius: "16px",
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#f8fafc",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginBottom: "24px"
};

const tableHeaderStyles = {
  textAlign: "left",
  padding: "12px",
  color: "#a7f3d0",
  borderBottom: "1px solid rgba(148,163,184,0.2)",
  fontSize: "14px"
};

const tableCellStyles = {
  padding: "12px",
  borderBottom: "1px solid rgba(148,163,184,0.1)",
  fontSize: "14px"
};

const inputStyles = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  color: "#0f172a",
  padding: "6px 10px",
  borderRadius: "6px",
  width: "100%",
  boxSizing: "border-box"
};

const DataTab = () => {
    const { utilityData, addOrUpdateData, deleteData, checkDuplicate, setIsProcessing } = useDataContext();
    const [dragActive, setDragActive] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const processFile = (file) => {
        if (!file) return;
        setIsProcessing(true);
        // Simulate VLM Edge Case processing
        setTimeout(() => {
            const isElectric = file.name.toLowerCase().includes('electric');
            const duplicate = checkDuplicate(isElectric ? 'TSSPDCL' : 'LocalGasProvider', 'Mar 2026');
            
            if (duplicate) {
                if(window.confirm('This looks like a duplicate of your March bill. Overwrite?')) {
                    // Update flow mock
                    addOrUpdateData({ id: duplicate.id, type: isElectric ? 'Electricity' : 'Gas', provider: isElectric ? 'TSSPDCL' : 'LocalGasProvider', billingPeriod: 'Mar 2026', value: 300, unit: isElectric ? 'kWh' : 'Therms' });
                }
            } else {
                // Simulate partial extraction (Missing date for testing if desired, or random missing)
                const missingDate = Math.random() > 0.8;
                addOrUpdateData({
                    type: isElectric ? 'Electricity' : 'Gas',
                    provider: 'AutoScannedProvider',
                    billingPeriod: missingDate ? null : 'Mar 2026',
                    value: isElectric ? 672 : 15,
                    unit: isElectric ? 'kWh' : 'Therms'
                });
            }
            setIsProcessing(false);
        }, 1500);
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditForm({ ...item });
    };

    const saveEdit = () => {
        addOrUpdateData({ ...editForm, isEdited: true });
        setEditingId(null);
    };

    const EmptyState = () => (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
            <h3 style={{ color: "#34d399", marginBottom: "8px" }}>No Data Yet</h3>
            <p style={{ color: "#64748b" }}>Drag and drop a utility bill above to get started.</p>
        </div>
    );

    return (
        <div style={pageStyles}>
            <main style={mainStyles}>
                <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Unified Data Sync</h1>
                <p style={{ color: "#475569", fontSize: "14px", marginBottom: "24px" }}>
                    Upload bills or input data manually. Changes sync in real-time across your dashboards.
                </p>

                <div 
                    style={{...dropZoneStyles, borderColor: dragActive ? '#4ade80' : 'rgba(74, 222, 128, 0.5)'}}
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <FaCloudUploadAlt size={48} color="#4ade80" style={{ margin: "0 auto", marginBottom: "16px" }} />
                    <p>Drag and drop documents here (.pdf, .jpg, .png)</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => processFile(e.target.files?.[0])}
                        className="hidden"
                    />
                </div>

                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0", boxShadow: "0 6px 18px rgba(15,23,42,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "18px", fontWeight: "600" }}>The Elements Table</h2>
                        <button onClick={() => addOrUpdateData({ type: 'Electricity', provider: '', billingPeriod: '', value: 0, unit: 'kWh', isEdited: true, billId: '', accountId: '' })} style={{ padding: "6px 12px", background: "#059669", color: "white", borderRadius: "8px", border: "none", cursor: "pointer" }}>+ Manual Entry</button>
                    </div>

                    {utilityData.length === 0 ? <EmptyState /> : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyles}>Provider</th>
                                    <th style={tableHeaderStyles}>Type</th>
                                    <th style={tableHeaderStyles}>Date</th>
                                    <th style={tableHeaderStyles}>Usage</th>
                                    <th style={tableHeaderStyles}>Identities (Acc / Bill)</th>
                                    <th style={tableHeaderStyles}>Status</th>
                                    <th style={tableHeaderStyles}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {utilityData.map(item => {
                                    const isEditing = editingId === item.id;
                                    const hasMissingDate = item.missingFields?.includes('Billing Date');
                                    const disableConfirm = isEditing && (!editForm.billingPeriod || !editForm.provider);

                                    return (
                                        <tr key={item.id} style={{ backgroundColor: item.isHighVariance ? "rgba(220, 38, 38, 0.1)" : "transparent" }}>
                                            <td style={tableCellStyles}>
                                                {isEditing ? <input style={inputStyles} value={editForm.provider || ''} onChange={e => setEditForm({...editForm, provider: e.target.value})} /> : item.provider || '-'}
                                            </td>
                                            <td style={tableCellStyles}>{item.type}</td>
                                            <td style={{ ...tableCellStyles, border: hasMissingDate && !isEditing ? "1px solid red" : "none" }}>
                                                {isEditing ? <input style={inputStyles} value={editForm.billingPeriod || ''} onChange={e => setEditForm({...editForm, billingPeriod: e.target.value})} /> : <span style={{ color: hasMissingDate ? '#ef4444' : 'inherit'}}>{hasMissingDate ? 'Missing' : item.billingPeriod}</span>}
                                            </td>
                                            <td style={tableCellStyles}>
                                                {isEditing ? <div style={{display:'flex', gap:'8px'}}><input type="number" style={inputStyles} value={editForm.value} onChange={e => setEditForm({...editForm, value: Number(e.target.value)})} /><input style={{...inputStyles, width:'60px'}} value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value})} /></div> : `${item.value} ${item.unit}`}
                                            </td>
                                            <td style={tableCellStyles}>
                                                {isEditing ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                       <input placeholder="Account ID" style={inputStyles} value={editForm.accountId || ''} onChange={e => setEditForm({...editForm, accountId: e.target.value})} />
                                                       <input placeholder="Bill ID" style={inputStyles} value={editForm.billId || ''} onChange={e => setEditForm({...editForm, billId: e.target.value})} />
                                                    </div>
                                                ) : (
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                       <div>Acc: <span style={{ color: '#d1d5db', fontFamily: 'monospace' }}>{item.accountId || '-'}</span></div>
                                                       <div>Bill: <span style={{ color: '#d1d5db', fontFamily: 'monospace' }}>{item.billId || '-'}</span></div>
                                                    </div>
                                                )}
                                            </td>
                                            <td style={tableCellStyles}>
                                                {item.isHighVariance && <FaExclamationTriangle color="#facc15" title="High Variance From Avg" style={{marginRight: '8px'}}/>}
                                                {item.isEdited && <span style={{ fontSize: '11px', padding:"2px 6px", background:"rgba(59,130,246,0.2)", color:"#93c5fd", borderRadius:"4px" }}>Manual</span>}
                                            </td>
                                            <td style={tableCellStyles}>
                                                {isEditing ? (
                                                    <button onClick={saveEdit} disabled={disableConfirm} style={{ padding: "4px 8px", background: disableConfirm ? "#4b5563" : "#10b981", color: "white", borderRadius: "4px", border: "none", cursor: disableConfirm ? "not-allowed" : "pointer" }}>Confirm</button>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <button onClick={() => startEdit(item)} style={{ background: "none", border: "none", cursor: "pointer", color: "#60a5fa" }}><FaEdit /></button>
                                                        <button onClick={() => deleteData(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171" }}><FaTrash /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DataTab;
