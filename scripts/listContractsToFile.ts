import fs from 'fs'; 
import path from 'path';   

declare const __dirname: string;

/**
 * Интерфейс для структуры данных из JSON файла
 * @interface DeploymentData
 * @property {string} address - Адрес контракта
 */
interface DeploymentData {
    address: string;
    [key: string]: any; // для других возможных полей
}

/**
 * Получает адреса контрактов из файлов деплоймента
 * @param {string} directoryPath - Путь к директории с файлами
 * @returns {Record<string, string>} Объект с парами имя_контракта:адрес
 */
function getDeploymentAddresses(directoryPath: string): Record<string, string> {
    const addresses: Record<string, string> = {};

    // Проверяем существование директории
    if (!fs.existsSync(directoryPath)) {
        console.error(`Директория не существует: ${directoryPath}`);
        return addresses;
    }

    try {
        // Получаем список всех файлов в директории
        const files = fs.readdirSync(directoryPath);
        
        // Фильтруем только JSON файлы и обрабатываем их
        files
            .filter(file => file.endsWith('.json'))
            .forEach(file => {
                try {
                    const filePath = path.join(directoryPath, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const data = JSON.parse(fileContent) as DeploymentData;
                    
                    if (data.address) {
                        const contractName = file.replace('.json', '');
                        addresses[contractName] = data.address;
                    }
                } catch (err) {
                    console.error(`Ошибка при обработке файла ${file}:`, err);
                }
            });
            
    } catch (err) {
        console.error('Ошибка при чтении директории:', err);
    }

    return addresses;
}

/**
 * Сохраняет адреса в текстовый файл
 * @param {Record<string, string>} addresses - Объект с адресами
 * @param {string} outputPath - Путь для сохранения файла
 */
function saveAddressesToFile(addresses: Record<string, string>, outputPath: string): void {
    try {
        const content = Object.entries(addresses)
            .map(([contract, address]) => `${contract}: ${address}`)
            .join('\n');
            
        fs.writeFileSync(outputPath, content);
        console.log('Адреса успешно сохранены в файл:', outputPath);
    } catch (err) {
        console.error('Ошибка при сохранении файла:', err);
    }
}

// Изменяем использование с относительным путём
const directoryPath = path.join(__dirname, '../deployments/arbitrum');
const outputPath = path.join(__dirname, '../contract_addresses.txt');
const addresses = getDeploymentAddresses(directoryPath);

// Вывод в консоль
Object.entries(addresses).forEach(([contract, address]) => {
    console.log(`${contract}: ${address}`);
});

// Сохранение в файл
saveAddressesToFile(addresses, outputPath);