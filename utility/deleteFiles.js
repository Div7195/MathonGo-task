import fs from 'fs/promises';
import path from 'path';

const dir = 'uploads';

export const deleteFiles = async () => {
    try {
        const files = await fs.readdir(dir);
        const unlinkPromises = files.map((file) => fs.unlink(path.join(dir, file)));
        await Promise.all(unlinkPromises);
        
    } catch (err) {
        console.error('Error deleting files:', err);
    }
};