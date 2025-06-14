"use client"

import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"

interface ShootingStar {
  id: number
  x: number
  y: number
  length: number
  angle: number
  speed: number
  opacity: number
}

export default function Home() {
  const [typedText, setTypedText] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const fullName = "岩倉一暉/Iwakura Kazuki"

  // 星の位置を初期化時に一度だけ生成
  const starPositions = useMemo(() => {
    const stars = [];
    
    // 1等星（最も明るく大きい）
    for (let i = 0; i < 5; i++) {
      stars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 60,
        magnitude: 1,
        size: 3,
        opacity: 0.9
      });
    }

    // 2等星
    for (let i = 0; i < 10; i++) {
      stars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 60,
        magnitude: 2,
        size: 2.5,
        opacity: 0.8
      });
    }

    // 3等星
    for (let i = 0; i < 20; i++) {
      stars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 60,
        magnitude: 3,
        size: 2,
        opacity: 0.7
      });
    }

    // 4等星
    for (let i = 0; i < 40; i++) {
      stars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 60,
        magnitude: 4,
        size: 1.5,
        opacity: 0.6
      });
    }

    // 5等星（最も暗く小さい）
    for (let i = 0; i < 80; i++) {
      stars.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 200,
        duration: 60,
        magnitude: 5,
        size: 1,
        opacity: 0.5
      });
    }

    return stars;
  }, []);

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullName.length) {
        setTypedText(fullName.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 150)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.body.style.cursor = "none"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = "auto"
    }
  }, [])

  // Generate shooting stars
  useEffect(() => {
    const generateShootingStar = () => {
      const newShootingStar: ShootingStar = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.5,
        length: (Math.random() * 80 + 40) * 1.3 * 1.2,
        angle: 30,
        speed: Math.random() * 3 + 2,
        opacity: 1,
      }

      setShootingStars((prev) => [...prev, newShootingStar])

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== newShootingStar.id))
      }, 2000)
    }

    // 初期表示時に3つの流れ星を生成
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        generateShootingStar()
      }, i * 300) // 300ms間隔で生成
    }

    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        generateShootingStar()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Animate shooting stars
  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          x: star.x + Math.cos((star.angle * Math.PI) / 180) * star.speed,
          y: star.y + Math.sin((star.angle * Math.PI) / 180) * star.speed,
          opacity: star.opacity - 0.01,
        })),
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

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

  return (
    <>
      <Head>
        <title>@ragojose</title>
        <meta
          name="description"
          content=""
        />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="@ragojose" />
        <meta
          property="og:description"
          content=""
        />
        <meta property="og:url" content="https://ragojose.com" />
        <meta property="og:type" content="website" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Custom FPS Crosshair Cursor */}
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative animate-pulse">
          <div className="absolute w-8 h-0.5 bg-green-400 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-green-400/50 animate-pulse"></div>
          <div className="absolute w-0.5 h-8 bg-green-400 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-green-400/50 animate-pulse"></div>
          <div className="absolute w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-red-500/50 animate-ping"></div>
          <div className="absolute -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -top-4 -left-4 w-2 h-2 border-t-2 border-l-2 border-green-400 animate-pulse"></div>
            <div className="absolute -top-4 -right-4 w-2 h-2 border-t-2 border-r-2 border-green-400 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-2 h-2 border-b-2 border-l-2 border-green-400 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-2 h-2 border-b-2 border-r-2 border-green-400 animate-pulse"></div>
          </div>
        </div>
      </div>

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
                animation: `moveStar ${pos.duration}s linear infinite`,
                animationDelay: `${pos.delay}s`,
                boxShadow: `0 0 ${pos.size * 2}px rgb(255, 255, 255)`,
                filter: 'brightness(1)',
              }}
            />
          ))}
        </div>

        {/* Shooting Stars */}
        <div className="absolute inset-0">
          {shootingStars.map((star) => (
            <div
              key={star.id}
              className="absolute"
              style={{
                left: star.x,
                top: star.y,
                width: star.length,
                height: 2.4,
                background: `linear-gradient(90deg, transparent, rgb(255, 255, 255), transparent)`,
                transform: `rotate(${star.angle}deg)`,
                boxShadow: `0 0 8px rgb(255, 255, 255)`,
                filter: 'brightness(1)',
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
          font-family: 'Noto Sans JP', sans-serif;
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
          0% {
            opacity: 0.3;
          }
          25% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.35;
          }
          75% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.3;
          }
        }

        .animate-twinkle {
          animation: twinkle infinite ease-in-out;
        }

        @keyframes moveStar {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100vw);
          }
        }
      `}</style>
    </>
  )
}
