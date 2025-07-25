"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

interface StarPosition {
  left: number
  top: number
  delay: number
  duration: number
  magnitude: number
  size: number
  opacity: number
}

interface ShootingStar {
  id: number
  x: number
  y: number
  length: number
  angle: number
  speed: number
  opacity: number
}

interface MousePosition {
  x: number
  y: number
}

export default function Home() {
  const [typedText, setTypedText] = useState("")
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const fullName = "岩倉一暉/Iwakura Kazuki"

  // 星の位置を初期化時に一度だけ生成
  const starPositions = useMemo<StarPosition[]>(() => {
    const stars: StarPosition[] = [];
    const magnitudes = [
      { count: 3, magnitude: 1, size: 2.5, opacity: 0.9, duration: () => Math.random() * 30 + 50 }, // 50-80s
      { count: 6, magnitude: 2, size: 2, opacity: 0.8, duration: () => Math.random() * 30 + 70 }, // 70-100s
      { count: 12, magnitude: 3, size: 1.5, opacity: 0.7, duration: () => Math.random() * 30 + 90 }, // 90-120s
      { count: 24, magnitude: 4, size: 1, opacity: 0.6, duration: () => Math.random() * 30 + 110 }, // 110-140s
      { count: 48, magnitude: 5, size: 0.5, opacity: 0.5, duration: () => Math.random() * 30 + 130 }, // 130-160s
    ];

    magnitudes.forEach(m => {
      for (let i = 0; i < m.count; i++) {
        stars.push({
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 10,
          duration: m.duration(),
          magnitude: m.magnitude,
          size: m.size,
          opacity: m.opacity
        });
      }
    });

    return stars;
  }, []);

  // タイピングアニメーション
  useEffect(() => {
    if (!isMounted) return;
    
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextCharacter = () => {
      if (currentIndex <= fullName.length) {
        setTypedText(fullName.substring(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeNextCharacter, 150);
      }
    };

    timeoutId = setTimeout(typeNextCharacter, 150);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fullName, isMounted]);

  

  // 流れ星の生成（最適化版）
  const generateShootingStar = useCallback(() => {
    if (typeof window === 'undefined' || shootingStars.length >= 1) return null;

    const angle = -45; // 右上から左下への固定角度
    const speed = Math.random() * 2 + 3; // 3-5の範囲の速度
    const length = Math.random() * 150 + 100; // 100-250pxの長さ

    const newShootingStar: ShootingStar = {
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth + window.innerWidth * 0.2, // 画面右側から出現
      y: Math.random() * -window.innerHeight * 0.5, // 画面上部から出現
      length: length,
      angle: angle,
      speed: speed,
      opacity: 1,
    };

    return newShootingStar;
  }, [shootingStars.length]);

  // 流れ星のアニメーション
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    
    const addShootingStar = () => {
      const newStar = generateShootingStar();
      if (newStar) {
        setShootingStars(prev => [...prev, newStar]);
        
        // 流れ星を削除
        setTimeout(() => {
          setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
        }, 4000); // 4秒後に削除
      }
    };
    
    // 定期的に流れ星を生成
    const interval = setInterval(() => {
      if (Math.random() < 0.5) { // 50%の確率で生成
        addShootingStar();
      }
    }, 5000); // 5秒ごとに試行
    
    return () => {
      clearInterval(interval);
      setShootingStars([]);
    };
  }, [generateShootingStar, isMounted]);

  // 流れ星のアニメーション更新
  useEffect(() => {
    if (!isMounted) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 60;
    const frameDuration = 1000 / fps;
    
    const updateShootingStars = (time: number) => {
      if (!lastTime) lastTime = time;
      const deltaTime = time - lastTime;
      
      if (deltaTime >= frameDuration) {
        setShootingStars(prevStars => {
          if (prevStars.length === 0) return [];
          
          return prevStars.map(star => ({
            ...star,
            x: star.x + Math.cos((star.angle * Math.PI) / 180) * star.speed,
            y: star.y + Math.sin((star.angle * Math.PI) / 180) * star.speed,
            opacity: Math.max(0, star.opacity - 0.005),
          }));
        });
        
        lastTime = time - (deltaTime % frameDuration);
      }
      
      animationFrameId = requestAnimationFrame(updateShootingStars);
    };
    
    animationFrameId = requestAnimationFrame(updateShootingStars);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMounted]);

  // マウント状態の設定
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // アニメーションのバリアント
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      

      

      <div className="min-h-screen bg-black text-white p-6 font-mono flex flex-col items-start justify-start relative">
        {/* Starry Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {starPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${pos.size}px`,
                height: `${pos.size}px`,
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                opacity: pos.opacity,
                animation: `moveStar ${pos.duration}s linear infinite, twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
                animationDelay: `${pos.delay}s, ${Math.random() * 3}s`,
                boxShadow: `0 0 ${pos.size * 1.5}px rgba(255, 255, 255, 0.8)`,
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {shootingStars.map((star) => (
            <div
              key={star.id}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                left: star.x,
                top: star.y,
                width: star.length,
                opacity: star.opacity,
                transform: `rotate(${star.angle}deg) translateX(-50%)`,
                transformOrigin: 'right center',
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.6)',
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-bold text-2xl mb-2 jp">
              {typedText}
              <span className="caret">_</span>
            </h1>
            <p className="text-sm text-[#909090] jp">Ehime→Fukuoka→TOKYO</p>
          </motion.div>

          {/* プロフィール画像 - モバイル版では名前の下に表示 */}
          <div className="md:hidden mb-8">
            <Image
              src="/avatar.png"
              alt="Profile"
              width={120}
              height={120}
              className="object-cover"
              priority
            />
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-bold mb-2 text-base jp">About</h2>
              <p className="text-sm text-[#ffffff] mb-4 leading-relaxed jp">
              VC（β_VentureCapial）にEIRで在籍したあとに、3Dアバター系のスタートアップを創業して今に至ります。<br />
              気軽に、DM（見逃すかもですが）からお声掛け頂ければと思います!
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-bold mb-2 text-base jp">Interest</h2>
              <ul className="list-none p-0 space-y-1 text-sm text-[#ffffff] jp">
                <li>- Startup/VC</li>
                <li>- ディープテック</li>
                <li>- 宇宙・ロボット（防衛分野）</li>
                <li>- 原子力・太陽光エネルギー</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-bold mb-2 text-base jp">Career</h2>
              <ul className="list-none p-0 space-y-2 text-sm jp">
              <li className="flex items-center">
                  <span className="mr-2">◆</span>
                  <span>(???)</span>
                  <span className="text-[#909090] ml-2">次の挑戦を模索中！</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">◆</span>
                  <span>TRYON</span>
                  <span className="text-[#909090] ml-2">Founder&CEO</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">◆</span>
                  <span>β_VentureCapial</span>
                  <span className="text-[#909090] ml-2">EIR（客員起業家）</span>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-bold mb-2 text-base jp">Hobby</h2>
              <div className="grid grid-cols-2 gap-4 jp">
                <div className="border border-[#909090] p-3 text-sm hover-box">アニメ/漫画</div>
                <div className="border border-[#909090] p-3 text-sm hover-box">大学駅伝 （NEW!）</div>
                <div className="border border-[#909090] p-3 text-sm hover-box">欧州サッカー</div>
                <div className="border border-[#909090] p-3 text-sm hover-box">執筆活動</div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="font-bold mb-2 text-base jp">Music Editor</h2>
              <div className="w-full h-[500px] border border-[#909090] rounded-lg overflow-hidden">
                <iframe
                  src="https://strudel.cc/#Ly8gImNvYXN0bGluZSIgQGJ5IGVkZHlmbHV4Ci8vIEB2ZXJzaW9uIDEuMApzYW1wbGVzKCdnaXRodWI6ZWRkeWZsdXgvY3JhdGUnKQpzZXRjcHMoLjc1KQpsZXQgY2hvcmRzID0gY2hvcmQoIjxCYm05IEZtOT4vNCIpLmRpY3QoJ2lyZWFsJykKc3RhY2soCiAgc3RhY2soIC8vIERSVU1TCiAgICBzKCJiZCIpLnN0cnVjdCgiPFt4KjwxIDI%2BIFt%2BQDMgeF1dIHg%2BIiksCiAgICBzKCJ%2BIFtyaW0sIHNkOjwyIDM%2BXSIpLnJvb20oIjwwIC4yPiIpLAogICAgbigiWzAgPDEgMyAzIDE%2BXSo8MiEzIDQ%2BIikucygiaGgiKSwKICAgIHMoInJkOjwxITMgMj4qMiIpLm1hc2soIjwwIDAgMSAxPi8xNiIpLmdhaW4oLjUpCiAgKS5iYW5rKCdjcmF0ZScpCiAgLm1hc2soIjxbMCAxXSAxIDEgMT4vMTYiLmVhcmx5KC41KSkKICAsIC8vIENIT1JEUwogIGNob3Jkcy5vZmZzZXQoLTEpLnZvaWNpbmcoKS5zKCJnbV9lcGlhbm8xOjEiKQogIC5waGFzZXIoNCkucm9vbSguNSkKICAsIC8vIE1FTE9EWQogIG4oIjwwITMgMSoyPiIpLnNldChjaG9yZHMpLm1vZGUoInJvb3Q6ZzEiKQogIC52b2ljaW5nKCkucygiZ21fYWNvdXN0aWNfYmFzcyIpLAogIGNob3Jkcy5uKCJbMCA8NCAzIDwyIDU%2BPioyXSg8MyA1Piw4KSIpCiAgLmFuY2hvcigiRDUiKS52b2ljaW5nKCkKICAuc2VnbWVudCg0KS5jbGlwKHJhbmQucmFuZ2UoLjQsLjgpKQogIC5yb29tKC43NSkuc2hhcGUoLjMpLmRlbGF5KC4yNSkKICAuZm0oc2luZS5yYW5nZSgzLDgpLnNsb3coOCkpCiAgLmxwZihzaW5lLnJhbmdlKDUwMCwxMDAwKS5zbG93KDgpKS5scHEoNSkKICAucmFyZWx5KHBseSgiMiIpKS5jaHVuayg0LCBmYXN0KDIpKQogIC5nYWluKHBlcmxpbi5yYW5nZSguNiwgLjkpKQogIC5tYXNrKCI8MCAxIDEgMD4vMTYiKQopCi5sYXRlKCJbMCAuMDFdKjQiKS5sYXRlKCJbMCAuMDFdKjIiKS5zaXplKDQp"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-x-4 gap-y-6 text-x jp">
              <Link href="https://x.com/kazuki_iwakura" className="text-[#ffffff] whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                X
              </Link>
              <Link href="https://note.com/king_kazu11/all" className="text-[#ffffff] whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                note
              </Link>
              <Link href="https://www.facebook.com/iwakurakazuki/" className="text-[#ffffff] whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                Facebook
              </Link>
              <Link href="https://sizu.me/iwakura" className="text-[#ffffff] whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                sizu.me
              </Link>
              <Link href="https://www.linkedin.com/in/%E4%B8%80%E6%9A%89-%E5%B2%A9%E5%80%89/" className="text-[#ffffff] whitespace-nowrap" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* プロフィール画像 - デスクトップ版では右端に表示 */}
      <div className="hidden md:block absolute top-6 right-6 w-24 h-24">
        <Image
          src="/avatar.png"
          alt="Profile"
          width={120}
          height={120}
          className="object-cover"
          priority
        />
      </div>

      <style jsx global>{`
        * {
          text-rendering: geometricPrecision;
        }
        body {
          background-color: black;
          margin: 0;
          padding: 0;
          font-weight: bold;
          color-scheme: light;
        }

        ::selection {
          background: white;
          color: black;
        }

        a {
          position: relative;
          text-decoration: none;
          color: #909090;
        }

        a::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          bottom: -1px;
          left: 0;
          background-color: #909090;
          transform: scaleX(1);
          transform-origin: bottom left;
          transition: transform 0.3s ease-out;
        }

        a:hover::after {
          transform: scaleX(0);
          transform-origin: bottom right;
        }

        .caret {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from, to {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .hover-box {
          transition: border-color 0.3s ease;
        }

        .hover-box:hover {
          border-color: white;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        @keyframes twinkle {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes moveStar {
          from {
            transform: translate(-10vw, -10vh);
          }
          to {
            transform: translate(110vw, 110vh);
          }
        }
      `}</style>
    </>
  )
}
