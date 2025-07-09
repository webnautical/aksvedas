import React, { useState, useRef, useEffect } from 'react';
import { APICALL } from '../../../utility/api/api';
import { toastifySuccess } from '../../../utility/Utility';
export default function SpinWheel() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const wheelRef = useRef();
    const [segmentList, setSegmentList] = useState([]);
    const [rotationAngle, setRotationAngle] = useState(0);
    useEffect(() => {
        fetchSegments();
    }, []);

    const fetchSegments = async () => {
        try {
            const res = await APICALL('/spin-wheel-segment');
            if (res?.status) {
                setSegmentList(res.data);
            } else {
                setSegmentList([]);
            }
        } catch (error) {
            console.error("Failed to load segments", error);
        }
    };

    const spin = async () => {
        setIsSpinning(true);
        setResult(null);

        try {
            const res = await APICALL('/spin');
            if (res?.status) {
                const data = res.data;
                const index = segmentList.findIndex(seg => seg.segment === data.segment);
                if (index === -1) {
                    console.error("Segment not found in local UI list");
                    setIsSpinning(false);
                    return;
                }

                const degreePerSegment = 360 / segmentList.length;
                const randomTurns = 5;
                const newRotation = rotationAngle + 360 * randomTurns + (segmentList.length - index) * degreePerSegment;

                // Animate wheel
                wheelRef.current.style.transition = 'transform 4s ease-out';
                wheelRef.current.style.transform = `rotate(${newRotation}deg)`;

                // Update rotationAngle after spin
                setRotationAngle(newRotation);

                setTimeout(() => {
                    setResult(data);
                    setIsSpinning(false);
                }, 4000);
            } else {
                console.error(res.data?.message || "Spin failed");
                setIsSpinning(false);
            }
        } catch (error) {
            console.error("API Error", error);
            setIsSpinning(false);
        }
    };
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#3b82f6'];
    console.log("segmentList", segmentList)
    return (

        <>

            <div className="wheel-container">
                <div
                    className="wheel"
                    ref={wheelRef}
                    style={{
                        position: 'relative',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        border: '4px solid #333',
                    }}
                >
                    {segmentList.map((item, i) => {
                        const angle = 360 / segmentList.length;
                        const rotate = angle * i;
                        const bgColor = colors[i % colors.length];

                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: '50%',
                                    height: '50%',
                                    top: '50%',
                                    left: '50%',
                                    transformOrigin: '0% 0%',
                                    backgroundColor: bgColor,
                                    transform: `rotate(${rotate}deg) skewY(-${90 - angle}deg)`,
                                    zIndex: segmentList.length - i, // Ensures upper slices overlap correctly
                                }}
                            >
                                <div
                                    style={{
                                        transform: `skewY(${90 - angle}deg) rotate(${angle / 2}deg)`,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        padding: '0 4px',
                                    }}
                                >
                                    <p
                                        style={{
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '10px',
                                            textAlign: 'center',
                                            margin: 0,
                                            maxWidth: '80px',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {item?.segment}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>



            <div className="d-flex align-items-center justify-content-center mt-3 flex-column">
                <div className="pointer">▼</div>
                <button className="spin-btn btn btn-success mt-2 mb-3" onClick={spin} disabled={isSpinning}>
                    {isSpinning ? "Spinning..." : "Spin Now"}
                </button>

                {result && (
                    <div className="result-message text-center">
                        🎉 You got: <strong>{result.segment}</strong>
                        {result?.coupon_code && (
                            <p>
                                Coupon Code: <b>{result.coupon_code}</b>
                                <button
                                    className="btn btn-primary btn-sm ms-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(result.coupon_code);
                                        toastifySuccess('Coupon code copied!');
                                    }}
                                >
                                    Copy
                                </button>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>


    );
}
