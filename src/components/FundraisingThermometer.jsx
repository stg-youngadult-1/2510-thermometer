import React, {useState, useEffect, useRef} from 'react';
import {Heart} from 'lucide-react';
import {useGoogleSheetsCell} from '../hooks/useGoogleSheets';

export default function FundraisingThermometer() {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const confettiRef = useRef(null);

    // Google Sheets에서 현재 모금액 데이터 가져오기
    const {cellValue: currentAmountStr, loading, error} = useGoogleSheetsCell('A1', {
        spreadsheetId: '1zZY36tzN8PWzYUqOBpHy6O7qCgG5_-JipDBj-ZXjco8',
        sheetName: '시트1',
        autoFetch: true
    });

    // 문자열을 숫자로 변환 (쉼표 제거)
    const currentAmount = parseInt(currentAmountStr.replace(/[^0-9]/g, '') || '0', 10);
    const targetAmount = 400000; // 목표 금액 100만원
    const targetProgress = (currentAmount / targetAmount) * 100;

    useEffect(() => {
        const timer = setTimeout(() => {
            const progress = Math.min((currentAmount / targetAmount) * 100, 100);
            setAnimatedProgress(progress);

            // 100% 이상일 때 컨페티 애니메이션 트리거
            if (progress >= 100 && !showConfetti) {
                setShowConfetti(true);
                // 5초 후 컨페티 숨기기
                setTimeout(() => setShowConfetti(false), 5000);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [targetProgress, currentAmount, targetAmount, showConfetti]);

    // 컨페티 애니메이션 컴포넌트
    const ConfettiAnimation = () => {
        if (!showConfetti) return null;

        return (
            <div className="fixed inset-0 pointer-events-none z-50" ref={confettiRef}>
                {Array.from({length: 50}).map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    >
                        <div
                            className="w-2 h-3 "
                            style={{
                                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)],
                                animation: `confetti-fall ${3 + Math.random() * 3}s linear infinite`
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <style>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) translateX(${(Math.random() - 0.5) * 400}px)  rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>

            <ConfettiAnimation />

            <div className="min-h-screen bg-gray-50 flex flex-col relative">
            {/* Header */}
            <div className="bg-white text-gray-800 py-3 px-6 text-center shadow-sm">
                <p className="text-lg font-bold text-gray-800 mt-2">💌 from 청일.. to 시선..</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    {/* Goal Display */}
                    <div className="text-left mb-8">
                        <div className="flex items-center gap-3">
                            <div className="text-5xl font-light text-blue-600">
                                {loading ? '...' : `${Math.round(targetProgress)}%`}
                            </div>
                            {targetProgress >= 100 && (
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse shadow-lg">
                                    🎉 100% 달성 완료
                                </div>
                            )}
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
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-purple-600"/>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">목표 금액</div>
                                <div className="text-sm font-bold text-gray-800">170,000원</div>
                            </div>
                        </div>
                        <div
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
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
                    <a
                        href="https://forms.gle/xHhUSMRquJbjHDZf7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-sm transition-colors block text-center"
                    >
                        지금 후원하기
                    </a>
                </div>
            </div>
            </div>
        </>
    );
}
