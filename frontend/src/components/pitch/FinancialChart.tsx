import type { AiFeedback } from '../../types';

interface Props {
    financialData: NonNullable<AiFeedback['financialData']>;
}

function formatValue(v: number) {
    return Math.abs(v) >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v}`;
}

export default function FinancialChart({ financialData }: Props) {
    const { revenue, profit, unitEconomics, notes } = financialData;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Financial Projections</h3>

            <div className="grid sm:grid-cols-2 gap-6">
                {revenue && revenue.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Revenue</p>
                        <div className="space-y-2">
                            {revenue.map((r, i) => {
                                const max = Math.max(...revenue.map(x => x.value), 1);
                                return (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-14 text-right">{r.label}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                            <div className="bg-green-500 h-full rounded-full transition-all flex items-center justify-end pr-1"
                                                 style={{ width: `${Math.max((r.value / max) * 100, 5)}%` }}>
                                                <span className="text-[10px] text-white font-medium">{formatValue(r.value)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {profit && profit.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Profit</p>
                        <div className="space-y-2">
                            {profit.map((p, i) => {
                                const max = Math.max(...profit.map(x => Math.abs(x.value)), 1);
                                const isLoss = p.value < 0;
                                return (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 w-14 text-right">{p.label}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                            <div className={`${isLoss ? 'bg-red-500' : 'bg-blue-500'} h-full rounded-full transition-all flex items-center justify-end pr-1`}
                                                 style={{ width: `${Math.max((Math.abs(p.value) / max) * 100, 5)}%` }}>
                                                <span className="text-[10px] text-white font-medium">{formatValue(p.value)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {unitEconomics && (
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                    {unitEconomics.cac != null && (
                        <div className="text-center">
                            <p className="text-lg font-bold text-primary-600">₹{unitEconomics.cac}</p>
                            <p className="text-xs text-gray-500">CAC</p>
                        </div>
                    )}
                    {unitEconomics.ltv != null && (
                        <div className="text-center">
                            <p className="text-lg font-bold text-green-600">₹{unitEconomics.ltv}</p>
                            <p className="text-xs text-gray-500">LTV</p>
                        </div>
                    )}
                    {unitEconomics.margin != null && (
                        <div className="text-center">
                            <p className="text-lg font-bold text-accent-600">{unitEconomics.margin}%</p>
                            <p className="text-xs text-gray-500">Margin</p>
                        </div>
                    )}
                </div>
            )}

            {notes && <p className="text-gray-500 text-xs mt-3">{notes}</p>}
        </div>
    );
}
