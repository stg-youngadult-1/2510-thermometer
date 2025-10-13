import React, {useState, useEffect} from 'react';
import {Heart} from 'lucide-react';
import {useGoogleSheetsCell} from '../hooks/useGoogleSheets';

export default function FundraisingThermometer() {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    // Google Sheets에서 현재 모금액 데이터 가져오기
    const {cellValue: currentAmountStr, loading, error} = useGoogleSheetsCell('A1', {
        spreadsheetId: '1zZY36tzN8PWzYUqOBpHy6O7qCgG5_-JipDBj-ZXjco8',
        sheetName: '시트1',
        autoFetch: true
    });

    // 문자열을 숫자로 변환 (쉼표 제거)
    const currentAmount = parseInt(currentAmountStr.replace(/[^0-9]/g, '') || '0', 10);
    const targetAmount = 170000; // 목표 금액 100만원
    const targetProgress = (currentAmount / targetAmount) * 100;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(Math.min((currentAmount / targetAmount) * 100, 100));
        }, 500);
        return () => clearTimeout(timer);
    }, [targetProgress]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white text-gray-800 py-3 px-6 text-center shadow-sm">
                <p className="text-lg font-bold text-gray-800 mt-2">💌 from 청일.. to 시선..</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    {/* Goal Display */}
                    <div className="text-left mb-8">
                        <div className="text-5xl font-light text-blue-600">
                            {loading ? '...' : `${Math.round(targetProgress)}%`}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">목표 달성률</div>
                    </div>

                    {/* Thermometer Container */}
                    <div className="relative flex items-start justify-center gap-6">
                        {/* Thermometer */}
                        <div className="relative" style={{width: '80px'}}>
                            {/* Background tube */}
                            <div className="relative bg-gray-200 rounded-full overflow-hidden"
                                 style={{height: '300px', width: '80px'}}>

                                {/* Filled portion */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-400 to-cyan-300 transition-all duration-1000 ease-out rounded-full"
                                    style={{height: `${animatedProgress}%`}}
                                >
                                    {/* Current percentage label inside thermometer */}
                                    <div
                                        className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white font-semibold text-lg">
                                        {loading ? '...' : `${Math.round(targetProgress)}%`}
                                    </div>
                                </div>

                                {/* Bulb at bottom */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                    <div
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-lg"></div>
                                </div>
                            </div>
                        </div>

                        {/* Scale marks on the right */}
                        <div className=" relative" style={{height: '300px'}}>
                            <div className="absolute inset-0 flex flex-col justify-between py-2">
                                {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((mark, index) => (
                                    <div key={mark} className="flex items-center gap-2">
                                        <div className="w-3 h-px bg-gray-300"></div>
                                        <div
                                            className={`text-sm ${mark % 20 === 0 ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                                            {mark}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-purple-600"/>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">목표 금액</div>
                                <div className="text-sm font-bold text-gray-800">170,000원</div>
                            </div>
                        </div>
                        <div
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-blue-600"/>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">현재 모금액</div>
                                <div className="text-sm font-bold text-gray-800">
                                    {loading ? '로딩 중...' : error ? '데이터 오류' : `${currentAmount.toLocaleString()}원`}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 py-6 px-6">
                <div className="max-w-md mx-auto space-y-4">
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-sm transition-colors">
                        지금 후원하기
                    </button>
                </div>
            </div>
        </div>
    );
}