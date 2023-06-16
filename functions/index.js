/**
    * Import function triggers from their respective submodules:
    *
    * const {onCall} = require("firebase-functions/v2/https");
* const {onDocumentWritten} = require("firebase-functions/v2/firestore");
*
    * See a full list of supported triggers at https://firebase.google.com/docs/functions
    */


const Configuration = require("openai").Configuration;
const OpenAIApi = require("openai").OpenAIApi;

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
    //   logger.info("Hello logs!", {structuredData: true});
    //   response.send("Hello from Firebase!");
    // });




exports.generate = functions.https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set('Access-Control-Allow-Credentials', 'true');


    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);
    const idea = request.body.idea;
    const tech = request.body.tech;
    await doYourWork(idea,tech);
    
    async function doYourWork(idea,tech) {
        try {
            const completion = await openai.createChatCompletion(
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: generatePrompt(idea,tech) }],
                    max_tokens: 1900,
                    temperature: 0.9,
                }
            )
            response.send(completion.data);




        } catch (error) {
            if (error.response) {
                console.error(error.response.status, error.response.data);
            } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
            }
        }

    }

    function generatePrompt(idea, tech) {
        return `You are a programming teacher. Provide me set of simple questions that will guid me through process of creating ${idea}. By answering those questions and implementing the solutions in ${tech} I will be able to build my website. Please only give questions, not any other extra text. and also implementation of each questions should be less than or equal to 100 lines of code.`;
    }


});
