const fs = require('fs');
const path = require('path');
const { timestamp } = require('./timestamp');
const { deleteTime } = require('./checkTime');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { Document, Packer, Paragraph } = require('docx');

// ... existing helper functions (shuffleArray, saveDocxFile, saveTxtFile)

// Helper to shuffle an array
function shuffleArray(array) {
	console.log('shuffling array:', array);
	return array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

//   // Save .txt file
// function saveTxtFile(filename, content) {
// 	const filePath = path.join(__dirname, 'public', filename);
// 	fs.writeFileSync(filePath, content, 'utf-8');
// 	return `/public/${filename}`;
// }

//   // Save .docx file
// async function saveDocxFile(filename, doc) {
// 	const buffer = await Packer.toBuffer(doc);
// 	const filePath = path.join(__dirname, 'public', filename);
// 	fs.writeFileSync(filePath, buffer);
// 	return `/public/${filename}`;
// }

// app.post('/generate', async (req, res) => {
async function Randomize (data) {
	try {
		const randomStr = Math.random().toString(36).substring(2, 6); // 4 random chars
		const now = new Date();
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const date = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		const variantId = `${year}${month}${date}_${hours}${minutes}${seconds}_${randomStr}`;
		// const variantId = uuidv4().slice(0, 25); // e.g. A23bc...
		const zipFilename = `eshuffle_${variantId}.zip`;
		const zipPath = path.join(__dirname, 'public', zipFilename);

		let examDocxPath
		let examTxtPath
		// let ansDocxPath
		let ansTxtPath
		let dirPath

		const types = ['A', 'B', 'C', 'D', 'E'];
		for (let i = 0; i < types.length; i++) {
			const shuffledQuestions = shuffleArray([...data.postQuestions]);
			const answerKey = [];

			const doc = new Document({
				sections: [
					{
					properties: {},
					children: [], // You can add Paragraphs here
					},
				],
				properties: {
					creator: "Eshufl",
					title: "Exam Document",
					description: "Generated Exam Questions",
				},
			});
			const docChildren = [
				new Paragraph(`${data.school}`),
				new Paragraph(`Subject: ${data.subject}`),
				new Paragraph(`Class: ${data.class}`),
				new Paragraph(`Term: ${data.term}`),
				new Paragraph(`Duration: ${data.duration}`),
				new Paragraph(`Instruction: ${data.instruction}`),
				new Paragraph(`Type: ${types[i]}`),
				new Paragraph(''),
			];

			let txtContent = `
				${data.school}
				Subject: ${data.subject}
				Class: ${data.class}
				Term: ${data.term}
				Duration: ${data.duration}
				Instruction: ${data.instruction}
				Type: ${types[i]}
			`;

			shuffledQuestions.forEach((q, i) => {
				const optionsArray = ['A', 'B', 'C', 'D'];
				// const options = shuffleArray([
				// 	{ label: optionsArray[0], text: q.correct_answer, isCorrect: true },
				// 	{ label: optionsArray[1], text: q.wrong_answer1, isCorrect: false },
				// 	{ label: optionsArray[2], text: q.wrong_answer2, isCorrect: false },
				// 	{ label: optionsArray[3], text: q.wrong_answer3, isCorrect: false },
				// ]);
				const options = shuffleArray([
					{ text: q.correct_answer, isCorrect: true },
					{ text: q.wrong_answer1, isCorrect: false },
					{ text: q.wrong_answer2, isCorrect: false },
					{ text: q.wrong_answer3, isCorrect: false },
				]);
				options.forEach((opt, index) => {
					opt.label = optionsArray[index];
				})
				// console.log('options:', options)

				const correct = options.find((opt) => opt.isCorrect);
				answerKey.push(`${i + 1}. ${correct.label}`);

				docChildren.push(new Paragraph(`${i + 1}. ${q.question}`));
				txtContent += `${i + 1}. ${q.question}\n`;

				options.forEach((opt) => {
					docChildren.push(new Paragraph(`${opt.label}. ${opt.text}`));
					txtContent += `${opt.label}. ${opt.text}\n`;
				});

				docChildren.push(new Paragraph(''));
				txtContent += `\n`;
			});

			doc.addSection({ children: docChildren });

			const ansDoc = new Document({
				sections: [
					{
					properties: {},
					children: [], // You can add Paragraphs here
					},
				],
				properties: {
					creator: "Eshufl",
					title: "Exam Document",
					description: "Generated Exam Questions",
				},
			});
			const ansChildren = answerKey.map((line) => new Paragraph(line));
			const ansTextContent = answerKey.join('\n');
			ansDoc.addSection({ children: ansChildren });

			// Save files
			// Construct the path
			dirPath = path.join(__dirname, 'public', variantId);
			const ansPath = path.join(dirPath, 'answers');
			const questPath = path.join(dirPath, 'questions');

			// Ensure each directory exists
			// if (!fs.existsSync(dirPath)) {
			// 	fs.mkdirSync(dirPath, { recursive: true });
			// }
			if (!fs.existsSync(ansPath)) {
				fs.mkdirSync(ansPath, { recursive: true });
			}
			if (!fs.existsSync(questPath)) {
				fs.mkdirSync(questPath, { recursive: true });
			}

			// Now build file paths
			examDocxPath = path.join(questPath, `Exam_type_${types[i]}.docx`);
			examTxtPath = path.join(questPath, `Exam_type_${types[i]}.txt`);
			// ansDocxPath = path.join(dirPath, `Answers_type_${types[i]}.docx`);
			ansTxtPath = path.join(ansPath, `Answers_type_${types[i]}.txt`);

			fs.writeFileSync(examTxtPath, txtContent);
			fs.writeFileSync(ansTxtPath, ansTextContent);
			fs.writeFileSync(examDocxPath, await Packer.toBuffer(doc));
			// fs.writeFileSync(ansDocxPath, await Packer.toBuffer(ansDoc));

		}
		// Create ZIP
		const output = fs.createWriteStream(zipPath);
		const archive = archiver('zip', { zlib: { level: 9 } });

		archive.pipe(output);
		archive.directory(dirPath, variantId);

		await archive.finalize();

		return new Promise((resolve, reject) => {
			output.on('close', () => {
				const filePath = `/public/${zipFilename}`;
				// Schedule deletion in 5 hours
				setTimeout(() => {
					try {
						// Delete ZIP file
						fs.unlink(zipPath, (err) => {
							if (err) {
								console.error(`Error deleting ZIP file ${zipPath} ${timestamp}:`, err);
							} else {
								console.log(`ZIP file ${zipPath} deleted after 5 hours ${timestamp}`);
							}
						});
				
						// Delete directory and its contents
						fs.rm(dirPath, { recursive: true, force: true }, (err) => {
							if (err) {
								console.error(`Error deleting directory ${dirPath} ${timestamp}:`, err);
							} else {
								console.log(`Directory ${dirPath} deleted after 5 hours ${timestamp}`);
							}
						});
					} catch (err) {
						console.error(`Error in scheduled cleanup ${timestamp}:`, err);
					}
				}, deleteTime);

				resolve(filePath);
			});
			output.on('error', reject);
		});

	} catch (err) {
		console.error(`Error generating exam bundle ${timestamp}:`, err);
		throw new Error('Failed to generate exam bundle');
	}
}

module.exports = Randomize
