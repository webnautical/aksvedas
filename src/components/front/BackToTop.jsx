import React, { useState, useEffect } from 'react';

function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            {isVisible && (
                <div className="back-to-top-button" onClick={scrollToTop}>
                    <span className="ms-2 cursor-pointer"> Back to top</span>{" "}
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" />
                        <path d="M10.7103 16.2541L10.1712 15.715C9.94293 15.4867 9.94293 15.1176 10.1712 14.8918L14.8894 10.1712C15.1176 9.94293 15.4867 9.94293 15.7126 10.1712L20.4308 14.8894C20.659 15.1176 20.659 15.4867 20.4308 15.7126L19.8917 16.2517C19.661 16.4823 19.2846 16.4775 19.0588 16.2419L16.2735 13.3183V20.2972C16.2735 20.6202 16.0137 20.88 15.6907 20.88H14.9137C14.5907 20.88 14.3309 20.6202 14.3309 20.2972V13.3183L11.5432 16.2444C11.3174 16.4823 10.941 16.4872 10.7103 16.2541Z" fill="black" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export default BackToTop;