const  conf= {
    EMAIL: String(import.meta.env.VITE_EMAIL),
    MOBILE_NUMBER: String(import.meta.env.VITE_MOBILE_NUMBER),
    PASSWORD: String(import.meta.env.VITE_PASSWORD),
    USERNAME: String(import.meta.env.VITE_USERNAME),
    NAME: String(import.meta.env.VITE_NAME),
    NAVIGATE: String(import.meta.env.VITE_NAVIGATE),
    GENDR: String(import.meta.env.VITE_GENDER),
    ROLE: String(import.meta.env.VITE_ROLE),
};

export default conf;
