import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/login?next=/admin',
        permanent: false,
      },
    ]
  },
}

export default withPayload(nextConfig)
