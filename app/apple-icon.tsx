import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0369A1',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
        }}
      >
        <svg
          width={180}
          height={180}
          viewBox="629 0 195 195"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            // eslint-disable-next-line max-len
            d="M542.23,195.29c-3.69-.61,106.88-193.84,107.45-194.67,1.03.78,177.83-1.15,178.36.49,25.53,45.92,58.86,98.43,84.07,147.81-44.02,2.88-69.27,4.09-109.63,7.7-12.76.69-26.14,4.14-37.48,2.43,0,0,-22.21-44.61-22.21-44.61-.27-.57-1.14-.58-1.42,0,0,0-27.18,52.41-27.18,52.41-.4.77-1.19,1.25-2.05,1.26-66.59,7.88-90.2,11.22-169.91,27.19Z"
            fill="#FB6F6F"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
