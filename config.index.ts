import { writeFile } from 'fs';


const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    production: true,
    firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY}',
        authDomain: '${process.env.AUTH_DOMAIN}',
        databaseURL: '${process.env.DB_URL}',
        projectId: '${process.env.PROJECT_ID}',
        storageBucket: '${process.env.STORAGE_BUCKET}',
        messagingSenderId: '${process.env.MSG_SENDER_ID}',
        appId: '${process.env.APP_ID}'
    },
    mapKey: '${process.env.MAP_KEY}'
  };
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
    if (err) {
        return console.log(err);
    }
});