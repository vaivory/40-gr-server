import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const file = {};

/**
 * Sugeneruojamas absoliutus kelias iki nurodyto failo.
 * @param {string} dir Reliatyvus kelias iki direktorijos kur laikomi norimi failai, e.g. `/data/users`
 * @param {string} fileName Norimo failo pavadinimas su jo pletiniu
 * @returns {string} Absoliutus kelias iki failo
 */
file.fullPath = (dir, fileName) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '../data', dir, fileName);
}
file.fullPublicPath = (trimmedFilePath) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '../public', trimmedFilePath);
}

/**
 * Sukuriamas failas, jei tokio dar nera nurodytoje direktorijoje.
 * @param {string} dir Reliatyvus kelias iki direktorijos kur laikomi norimi failai, pvz.: /data/users
 * @param {string} fileName Norimo failo pavadinimas su jo pletiniu
 * @param {object} content Objektas (pvz.: {...}), kuri norime irasyti i kuriama faila
 * @returns {boolean|string} Sekmes atveju - `true`; Klaidos atveju - klaidos pranesimas
 */
file.create = async (dir, fileName, content) => {
    let fileDescriptor = null;
    try {
        const filePath = file.fullPath(dir, fileName);
        fileDescriptor = await fs.open(filePath, 'wx');
        await fs.writeFile(fileDescriptor, JSON.stringify(content));
        return true;
    } catch (error) {
        return false;
    } finally {
        if (fileDescriptor) {
            fileDescriptor.close();
        }
    }
}

/**
 * Perskaitomas failo turinys (tekstinis failas).
 * @param {string} dir Reliatyvus kelias iki direktorijos kur laikomi norimi failai, e.g. `/data/users`
 * @param {string} fileName Norimo failo pavadinimas su jo pletiniu
 * @returns {Promise<string|boolean>} Sekmes atveju - failo turinys; Klaidos atveju - `false`
 */
file.read = async (dir, fileName) => {
    try {
        const filePath = file.fullPath(dir, fileName);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
    } catch (error) {
        return false;
    }
}

file.readPublic = async (trimmedFilePath) => {
    try {
        const filePath = file.fullPublicPath(trimmedFilePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
    } catch (error) {
        return false;
    }
}

file.readPublicBinary = async (trimmedFilePath) => {
    try {
        const filePath = file.fullPublicPath(trimmedFilePath);
        const fileContent = await fs.readFile(filePath);
        return fileContent;
    } catch (error) {
        return false;
    }
}

/**
 * JSON failo turinio atnaujinimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @param {Object} content JavaScript objektas, pvz.: `{name: "Marsietis"}`.
 * @returns {boolean} Pozymis, ar funkcija sekmingai atnaujintas nurodyta faila.
 */
file.update = async (dir, fileName, content) => {
    let fileDescriptor = null;
    try {
        const filePath = file.fullPath(dir, fileName);
        fileDescriptor = await fs.open(filePath, 'r+');
        await fileDescriptor.truncate();
        await fs.writeFile(fileDescriptor, JSON.stringify(content));
        return true;
    } catch (error) {
        return false;
    } finally {
        if (fileDescriptor) {
            await fileDescriptor.close();
        }
    }
}

/**
 * JSON failo istrinimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @returns {boolean} Pozymis, ar funkcija sekmingai istrintas nurodyta faila.
 */
file.delete = async (dir, fileName) => {
    try {
        const filePath = file.fullPath(dir, fileName);
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

export { file };
