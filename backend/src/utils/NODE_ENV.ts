export const NODE_ENV: 'development' | 'production' = ['development', 'test'].includes(process.env.NODE_ENV ?? 'production')
    ? 'development'
    : 'production'
export const NODE_ENV_DEV = NODE_ENV === 'development'
export const NODE_ENV_PROD = NODE_ENV === 'production'
