import reportWebVitals from './reportWebVitals'
import chroma from 'chroma-js'

const canvas = document.getElementById('live-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  brightness: number
  type: 'shell' | 'ash'

  constructor({ x, y, vx, vy, color, brightness, type }: Particle) {
    this.x = x
    this.y = y
    this.vx = vx
    this.vy = vy
    this.color = color
    this.brightness = brightness
    this.type = type
  }
}

let particles: Particle[] = []

const explode = (particle: Particle, particles: Particle[]) => {
  for (let i = 0; i < 100; i++) {
    const speed = 2 + 2 * Math.random()
    const angle = Math.random() * 2 * Math.PI
    particles.push(
      new Particle({
        x: particle.x,
        y: particle.y,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        color: particle.color,
        brightness: 1,
        type: 'ash',
      })
    )
  }
}

const frame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const nextParticles: Particle[] = []

  for (let i = 0, l = particles.length; i < l; i++) {
    const particle = particles[i]

    particle.vy -= 0.03
    particle.x += particle.vx
    particle.y += particle.vy

    ctx.fillStyle = particle.color

    switch (particle.type) {
      case 'shell':
        if (particle.vy > 0.1) {
          nextParticles.push(particle)
        } else {
          explode(particle, nextParticles)
        }
        ctx.fillRect(particle.x, height - particle.y, 5, 5)
        break

      case 'ash':
        if (particle.y > 0) {
          nextParticles.push(particle)
        }
        ctx.fillRect(particle.x, height - particle.y, 3, 3)
        break
    }
  }

  particles = nextParticles

  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)

const colors = ['#FF00FF', 'blue', 'purple']

setInterval(() => {
  particles.push(
    new Particle({
      x: Math.random() * width,
      y: 10,
      vx: Math.random() * 1 - 0.5,
      vy: 4 + 2.5 * Math.random(),
      color: chroma.random().hex(),
      brightness: 1,
      type: 'shell',
    })
  )
}, 1000)

// document.addEventListener('keydown', logKey)
//
// const launch = (color: string) => {
//   particles.push(
//     new Particle({
//       x: Math.random() * width,
//       y: 10,
//       vx: Math.random() * 1 - 0.5,
//       vy: 4 + 2.5 * Math.random(),
//       color: color,
//       brightness: 1,
//       type: 'shell',
//     })
//   )
// }

// function logKey(e: KeyboardEvent) {
//   console.log(e.code)
//   switch (e.code) {
//     case 'KeyP':
//       launch('#ff00ff')
//       break
//     case 'KeyG':
//       launch('#00ff00')
//       break
//     case 'KeyB':
//       launch('#0000ff')
//       break
//   }
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

const height = window.innerHeight
const width = window.innerWidth

canvas.width = width
canvas.height = height
