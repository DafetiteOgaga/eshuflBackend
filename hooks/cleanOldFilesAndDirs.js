const fs = require('fs');
const path = require('path');
const { deleteTime } = require('./checkTime');
const PUBLIC_DIR = path.join(__dirname, 'public');

function cleanOldFilesAndDirs(dir = PUBLIC_DIR) {
	fs.readdir(dir, (err, entries) => {
		if (err) {
			console.error('Error reading directory:', err);
			return;
		}

		entries.forEach(entry => {
			const fullPath = path.join(dir, entry);

			// Match file naming: eshuffle_YYYYMMDD_HHMMSS_
			const fileMatch = entry.match(/^eshuffle_(\d{8})_(\d{6})_/);

			// Match dir naming: YYYYMMDD_HHMMSS_xxxx
			const dirMatch = entry.match(/^(\d{8})_(\d{6})_/);

			let fileTimestampStr;

			if (fileMatch) {
				fileTimestampStr = fileMatch[1] + fileMatch[2]; // YYYYMMDD + HHMMSS
			} else if (dirMatch) {
				fileTimestampStr = dirMatch[1] + dirMatch[2]; // YYYYMMDD + HHMMSS
			} else {
				// No match, skip this entry
				return;
			}

			// Parse timestamp to Date
			const year = fileTimestampStr.slice(0, 4);
			const month = fileTimestampStr.slice(4, 6);
			const day = fileTimestampStr.slice(6, 8);
			const hour = fileTimestampStr.slice(8, 10);
			const minute = fileTimestampStr.slice(10, 12);
			const second = fileTimestampStr.slice(12, 14);

			const fileTimestamp = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

			if (isNaN(fileTimestamp)) {
				// Invalid date, skip
				return;
			}

			const age = Date.now() - fileTimestamp.getTime();

			if (age > deleteTime) {
				fs.stat(fullPath, (err, stats) => {
					if (err) {
						console.error(`Error getting stats for ${entry}:`, err);
						return;
					}

					if (stats.isDirectory()) {
						// Delete directory recursively
						fs.rm(fullPath, { recursive: true, force: true }, (err) => {
							if (err) {
								console.error(`Failed to delete directory ${entry}:`, err);
							} else {
								console.log(`Deleted old directory: ${entry}`);
							}
						});
					} else {
						// Delete file
						fs.unlink(fullPath, (err) => {
							if (err) {
								console.error(`Failed to delete file ${entry}:`, err);
							} else {
								console.log(`Deleted old file: ${entry}`);
							}
						});
					}
				});
			}
		});
	});
}

module.exports = { cleanOldFilesAndDirs }

// Run periodically every hour
// setInterval(() => {
// 	cleanOldFilesAndDirs();
// }, 60 * 60 * 1000);
