import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from "react";


const VideoCarousel = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    }

    return(
        <div className="extra-resources">
            <h3>Learn something new</h3>
            <p>Explore budgeting videos and financial podcasts to enhance your knowledge.</p>

            <div className="carousel-container">
                <button className="scroll-btn left" onClick={() => scroll("left")}>
                    <FaChevronLeft size={25} />
                </button>

                <div className="video-scroll-container" ref={scrollRef}>
                    <div className="video-wrapper">
                        <p className="video-titles">How to save $10k Effortlessly</p>
                        <iframe
                            src="https://www.youtube.com/embed/JP__utZQLb8?si=cjDBia0QztPtlqTy"
                            title="How to save $10k Effortlessly"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-wrapper">
                        <p className="video-titles">6 Ways Insecurity is Wasting Your Money</p>
                        <iframe
                            src="https://youtube.com/embed/wsgAI9i3oow?si=Qdld1ImadhzPltKk"
                            title="6 Ways Insecurity is Wasting Your Money"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-wrapper">
                        <p className="video-titles">Do This Every Time You Get a Paycheck</p>
                        <iframe
                            src="https://www.youtube.com/embed/IIKr2915l2g?si=k387VqGkhBrRRsk9"
                            title="Do This Every Time You Get a Paycheck"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-wrapper">
                        <p className="video-titles">How to Write a Resume with No Experience</p>
                        <iframe
                            src="https://youtube.com/embed/1HvgDkD5RlM?si=Bdp7waGr2jlWODYt"
                            title="How to Write a Resume with No Experience"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-wrapper">
                        <p className="video-titles">My Credit Cards are Maxxed Out!</p>
                        <iframe
                            src="https://www.youtube.com/embed/37inkhgXnDg?si=Els8UkmO5x0tr5P2"
                            title="My Credit Cards are Maxxed Out!"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-wrapper">
                        <p className="video-titles">How to Get Cheaper Car Insurance</p>
                        <iframe
                            src="https://www.youtube.com/embed/IRi5Z7pp1K4?si=x-O5RFS33VXAnkaz"
                            title="How to Get Cheaper Car Insurance"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="video-wrapper">
                        <p className="video-titles">What is a Mutual FUND?</p>
                        <iframe
                            src="https://www.youtube.com/embed/TPS22HRRY1k?si=SqQJssJrnbzMD4MO"
                            title="What is a Mutual Fund?"
                            allowFullScreen>
                        </iframe>
                    </div>
                </div>

                <button className="scroll-btn right" onClick={() => scroll("right")}>
                    <FaChevronRight size={25} />
                </button>
            </div>
        </div>
    )
}

export default VideoCarousel;