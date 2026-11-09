import type { AiFeedback } from '../../types';
import FinancialChart from './FinancialChart';

interface Props {
  feedback: AiFeedback;
}

export default function AiFeedbackReport({ feedback }: Props) {
  return (
      <div className="space-y-4">
        {/* Header with score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">AI Analysis</h2>
            {typeof feedback.overallScore === 'number' && (
                <span className="text-2xl font-bold text-primary-600">{feedback.overallScore}/10</span>
            )}
          </div>
          {feedback.summary && <p className="text-gray-600 text-sm">{feedback.summary}</p>}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {feedback.strengths?.length > 0 && (
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
                <ul className="space-y-1.5">
                  {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-green-700 text-sm flex gap-2">
                        <span className="text-green-500 mt-0.5">&#10003;</span> {s}
                      </li>
                  ))}
                </ul>
              </div>
          )}
          {feedback.improvements?.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                <h3 className="font-semibold text-yellow-800 mb-2">Areas to Improve</h3>
                <ul className="space-y-1.5">
                  {feedback.improvements.map((s, i) => (
                      <li key={i} className="text-yellow-700 text-sm flex gap-2">
                        <span className="text-yellow-500 mt-0.5">&rarr;</span> {s}
                      </li>
                  ))}
                </ul>
              </div>
          )}
          {feedback.investorQuestions?.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Investors May Ask</h3>
                <ul className="space-y-1.5">
                  {feedback.investorQuestions.map((q, i) => (
                      <li key={i} className="text-blue-700 text-sm flex gap-2">
                        <span className="text-blue-400 mt-0.5">&bull;</span> {q}
                      </li>
                  ))}
                </ul>
              </div>
          )}
          {feedback.pitchTips?.length > 0 && (
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <h3 className="font-semibold text-purple-800 mb-2">Pitch Tips</h3>
                <ul className="space-y-1.5">
                  {feedback.pitchTips.map((tip, i) => (
                      <li key={i} className="text-purple-700 text-sm flex gap-2">
                        <span className="text-purple-400 mt-0.5">&bull;</span> {tip}
                      </li>
                  ))}
                </ul>
              </div>
          )}
        </div>

        {/* Market insights */}
        {feedback.marketInsights && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Market Insights</h3>
              <p className="text-gray-600 text-sm">{feedback.marketInsights}</p>
            </div>
        )}

        {/* Financial chart */}
        {feedback.financialData && (
            <FinancialChart financialData={feedback.financialData} />
        )}
      </div>
  );
}