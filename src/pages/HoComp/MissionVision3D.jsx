import React, { useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const badgeFloat = keyframes`
  0% { transform: translateY(0) translateZ(30px); }
  50% { transform: translateY(-5px) translateZ(30px); }
  100% { transform: translateY(0) translateZ(30px); }
`;

const MissionVision3D = () => {
  const missionRef = useRef(null);
  const visionRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = [missionRef.current, visionRef.current];

      cards.forEach((card) => {
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 15;
        const angleY = (centerX - x) / 15;

        card.style.transform = `
          perspective(1200px)
          rotateX(${angleX}deg)
          rotateY(${angleY}deg)
        `;

        // Parallax effect for inner elements
        const content = card.querySelector(".content");
        const cornerDate = card.querySelector(".corner-date");

        if (content) {
          const depthX = (centerX - x) / 40;
          const depthY = (centerY - y) / 40;
          content.style.transform = `translateZ(30px) translateX(${depthX}px) translateY(${depthY}px)`;
        }

        if (cornerDate) {
          cornerDate.style.transform = `translateZ(40px) rotate(${
            angleY * 0.3
          }deg)`;
        }
      });
    };

    const handleMouseLeave = () => {
      [missionRef.current, visionRef.current].forEach((card) => {
        if (!card) return;
        card.style.transform = "perspective(1200px) rotateX(0) rotateY(0)";

        const content = card.querySelector(".content");
        const cornerDate = card.querySelector(".corner-date");

        if (content) content.style.transform = "translateZ(30px)";
        if (cornerDate) cornerDate.style.transform = "translateZ(30px)";
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    const cards = [missionRef.current, visionRef.current];
    cards.forEach((card) => {
      if (card) {
        card.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cards.forEach((card) => {
        if (card) {
          card.removeEventListener("mouseleave", handleMouseLeave);
        }
      });
    };
  }, []);

  return (
    <StyledWrapper>
      <div className="section-container">
        <div className="header">
          <h2>
            Our <span className="gold">Purpose</span>
          </h2>
          <div className="underline"></div>
          <p className="subtitle">
            Driving Ethiopia's creative revolution through art and community
          </p>
        </div>

        <div className="cards-container">
          {/* Mission Card */}
          <div className="card mission" ref={missionRef}>
            <div className="card-inner">
              <div className="corner-date">
                <span className="month">IMPACT</span>
                <span className="date">❤️</span>
              </div>
              <div className="content">
                <h3>
                  Our <span className="gold">Mission</span>
                </h3>
                <p>
                  To ignite Ethiopia's creative spirit by promoting artistic
                  excellence, building vibrant community connections, and
                  empowering future generations.
                </p>
                <div className="highlights">
                  {[
                    "Artistic Excellence",
                    "Community Building",
                    "Youth Empowerment",
                  ].map((item, i) => (
                    <div key={i} className="highlight-item">
                      <div className="gold-dot"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-back"></div>
              <div className="card-side left"></div>
              <div className="card-side right"></div>
              <div className="card-side top"></div>
              <div className="card-side bottom"></div>
              <div className="glow"></div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="card vision" ref={visionRef}>
            <div className="card-inner">
              <div className="corner-date">
                <span className="month">VISION</span>
                <span className="date">✨</span>
              </div>
              <div className="content">
                <h3>
                  Our <span className="gold">Vision</span>
                </h3>
                <p>
                  A Ethiopia where art transcends boundaries, inspires
                  innovation, and becomes the catalyst for lasting social
                  change.
                </p>
                <div className="stats">
                  {[
                    { value: "950+", label: "Lives Touched" },
                    { value: "5+", label: "Partners" },
                    { value: "∞", label: "Possibilities" },
                  ].map((stat, i) => (
                    <div key={i} className="stat-box">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-back"></div>
              <div className="card-side left"></div>
              <div className="card-side right"></div>
              <div className="card-side top"></div>
              <div className="card-side bottom"></div>
              <div className="glow"></div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Base Styles */
  .section-container {
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    perspective: 1200px;
    background: linear-gradient(
      0deg,
      #ffffff,
      #ffffff,
      #d4af3775,
      #d4af37dd,
      #d4af3775,
      #ffffff,
      #ffffff,
      #ffffff
    );
    overflow: hidden;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;

    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 0.5rem;

      .gold {
        color: #d4af37;
      }
    }

    .underline {
      width: 60px;
      height: 3px;
      background: #d4af37;
      margin: 0 auto;
    }

    .subtitle {
      font-size: 0.9rem;
      color: #555;
      margin-top: 0.5rem;
    }
  }

  .cards-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* Card Styles */
  .card {
    position: relative;
    min-height: 280px;
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    background-color: transparent;
    transform-style: preserve-3d;
    transition: all 0.3s ease;
    animation: ${floatAnimation} 4s ease-in-out infinite;
    border-radius: 8px;

    &:hover {
      animation: none;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      background-color: #f5f5f5;
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-sizing: border-box;
      border-radius: 8px;
    }

    /* 3D Card Sides */
    .card-back,
    .card-side {
      position: absolute;
      background: linear-gradient(to bottom, #f5f5f5, #e5e5e5);
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-sizing: border-box;
    }

    .card-back {
      width: 100%;
      height: 100%;
      transform: translateZ(-15px);
      background: #e5e5e5;
      border-radius: 8px;
    }

    .card-side {
      background: #e0e0e0;
      opacity: 0.8;

      &.left {
        width: 15px;
        height: calc(100% - 30px);
        left: 0;
        top: 15px;
        transform: rotateY(-90deg) translateX(-15px);
        transform-origin: left center;
      }

      &.right {
        width: 15px;
        height: calc(100% - 30px);
        right: 0;
        top: 15px;
        transform: rotateY(90deg) translateX(15px);
        transform-origin: right center;
      }

      &.top {
        width: calc(100% - 30px);
        height: 15px;
        top: 0;
        left: 15px;
        transform: rotateX(90deg) translateY(-15px);
        transform-origin: center top;
      }

      &.bottom {
        width: calc(100% - 30px);
        height: 15px;
        bottom: 0;
        left: 15px;
        transform: rotateX(-90deg) translateY(15px);
        transform-origin: center bottom;
      }
    }

    .glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at center,
        rgba(212, 175, 55, 0.1) 0%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 8px;
    }

    &:hover .glow {
      opacity: 1;
    }

    .corner-date {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 50px;
      height: 50px;
      background: white;
      border: 2px solid #d4af37;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.2);
      z-index: 2;
      animation: ${badgeFloat} 3s ease-in-out infinite;
      border-radius: 5px;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(212, 175, 55, 0.1),
          transparent
        );
        z-index: -1;
      }

      .month {
        font-size: 0.6rem;
        font-weight: 700;
        color: #d4af37;
        text-transform: uppercase;
      }

      .date {
        font-size: 1.2rem;
        transition: transform 0.3s ease;
      }

      &:hover {
        animation: ${badgeFloat} 1.5s ease-in-out infinite;

        .date {
          transform: scale(1.2);
        }
      }
    }

    .content {
      position: relative;
      z-index: 1;
      transform: translateZ(30px);

      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;

        .gold {
          color: #d4af37;
        }
      }

      p {
        font-size: 0.95rem;
        line-height: 1.5;
        color: #555;
        margin-bottom: 1.5rem;
      }
    }
  }

  /* Mission Card Specific */
  .mission {
    .card-inner {
      background: linear-gradient(
          135deg,
          #0000 18.75%,
          #f9f9f9 0 31.25%,
          #0000 0
        ),
        repeating-linear-gradient(45deg, #f9f9f9 -6.25% 6.25%, #ffffff 0 18.75%);
      background-size: 40px 40px;
    }

    .highlights {
      .highlight-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.6rem;
        transform: translateZ(20px);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateZ(20px) translateX(5px);
        }

        .gold-dot {
          width: 8px;
          height: 8px;
          background: #d4af37;
          border-radius: 50%;
          margin-right: 8px;
          flex-shrink: 0;
        }

        span {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }
      }
    }
  }

  /* Vision Card Specific */
  .vision {
    .card-inner {
      background: linear-gradient(
          135deg,
          #0000 18.75%,
          #f0f0f0 0 31.25%,
          #0000 0
        ),
        repeating-linear-gradient(
          -45deg,
          #f0f0f0 -6.25% 6.25%,
          #ffffff 0 18.75%
        );
      background-size: 40px 40px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;

      .stat-box {
        background: white;
        padding: 0.6rem;
        text-align: center;
        box-shadow: 0 3px 10px -3px rgba(0, 0, 0, 0.1);
        transform: translateZ(15px);
        transition: all 0.3s ease;

        &:hover {
          transform: translateZ(25px);
          box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.15);
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 0.2rem;
        }

        .stat-label {
          font-size: 0.65rem;
          color: #666;
        }
      }
    }
  }

  /* Desktop Styles */
  @media (min-width: 768px) {
    .section-container {
      padding: 3rem 2rem;
    }

    .header {
      margin-bottom: 3rem;

      h2 {
        font-size: 2.5rem;
      }

      .subtitle {
        font-size: 1rem;
      }
    }

    .cards-container {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .card {
      min-height: 320px;

      .card-inner {
        padding: 2rem;
      }

      .corner-date {
        width: 60px;
        height: 60px;
        top: 20px;
        right: 20px;

        .month {
          font-size: 0.7rem;
        }

        .date {
          font-size: 1.5rem;
        }
      }

      .content {
        h3 {
          font-size: 1.8rem;
        }

        p {
          font-size: 1.05rem;
        }
      }
    }

    .mission {
      .highlights {
        grid-template-columns: 1fr;
      }
    }

    .vision {
      .stats {
        grid-template-columns: repeat(3, 1fr);

        .stat-box {
          padding: 0.8rem;

          .stat-value {
            font-size: 1.2rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }
        }
      }
    }
  }

  /* Small Mobile Adjustments */
  @media (max-width: 400px) {
    .section-container {
      padding: 1.5rem 1rem;
    }

    .card {
      min-height: 260px;

      .content {
        h3 {
          font-size: 1.3rem;
        }

        p {
          font-size: 0.9rem;
        }
      }
    }

    .vision .stats {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

export default MissionVision3D;
