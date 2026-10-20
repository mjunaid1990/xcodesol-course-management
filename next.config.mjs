import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  images: {
    remotePatterns: [],
  },
}

export default withPayload(nextConfig)
