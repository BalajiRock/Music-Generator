const describe_feeling_input = document.getElementById('describe_feeling_input');
const mood_input = document.getElementById('Mood_input');
const atmosphere_input = document.getElementById('Atmosphere_input');
const tempo_input = document.getElementById('Tempo_input');

const img_output = document.getElementById('img_output');
const note_output = document.getElementById('note_output');
const title_output = document.getElementById('title_output');
const discription_output = document.getElementById('discription_output');
const OPENAI_API_KEY0 = process.env.OPENAI_API_KEY1;
const OPENAI_API_KEY1 = process.env.OPENAI_API_KEY2;
const OPENAI_API_KEY2 = process.env.OPENAI_API_KEY3;
const OPENAI_API_KEY3 = process.env.OPENAI_API_KEY4;
const OPENAI_API_KEY4 = process.env.OPENAI_API_KEY5;

const url = "https://api.openai.com/v1/completions";
const url1 = 'https://api.openai.com/v1/images/generations'

document.getElementById("submit_button").addEventListener("click", () => {
    var FeelingsInput = describe_feeling_input.value;
    var MoodInput = mood_input.value;
    var AtmosphereInput = atmosphere_input.value;
    var TempoInput = tempo_input.value;

    FetchDescription(FeelingsInput, MoodInput, AtmosphereInput, TempoInput);
});

async function FetchDescription(FeelingsInput, MoodInput, AtmosphereInput, TempoInput) {
    try {
        const response = await fetchAPI(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY4
            },
            body: JSON.stringify({
                'model': 'text-davinci-003',
                'prompt': `
                Genarate creative and motivational and profestional for the info ${FeelingsInput},
                 mood: ${MoodInput}  , Atmosphere: ${AtmosphereInput}, and Tempo: ${TempoInput} keeping all this in mind.
                 
               
                . `,
                'max_tokens': 700, // Replace with your desired value
                'temperature': 0.8 // Replace with your desired value
            })
        });

        const data = await response.json();
        setTimeout(function () {
            discription_output.innerText = data.choices[0].text.trim();

            FetchTitle(FeelingsInput, MoodInput, AtmosphereInput, TempoInput, data.choices[0].text);
        }, 2000);
    } catch (error) {
        console.log("Error:", error);
    }
}

async function FetchTitle(FeelingsInput, MoodInput, AtmosphereInput, TempoInput, Description) {
    try {
        const response = await fetchAPI(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY3
            },
            body: JSON.stringify({
                'model': 'text-davinci-003',
                'prompt': `Generate an innovative and appealing title for ${Description} dont decribe 
                it has title and give proper matching and profacinal one and examle are bellow.
                ###
                "Fading Echoes of Yesterday"
                ###
                 "Sunshine Smile"
                ###
                 "Velocity Rush" Give only one title not any "###" content `
                ,
                max_tokens: 100
            })
        });
        const data = await response.json();
        setTimeout(function () {
            title_output.innerText = data.choices[0].text.trim();
            FetchMusicalNotes(FeelingsInput, MoodInput, AtmosphereInput, TempoInput, Description, data.choices[0].text);
        }, 2000);
    } catch (error) {
        console.log("Error:", error);
    }
}

async function FetchMusicalNotes(FeelingsInput, MoodInput, AtmosphereInput, TempoInput, Description, Title) {
    try {
        const response = await fetchAPI(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + OPENAI_API_KEY2
            },
            body: JSON.stringify({
                'model': 'text-davinci-003',
                'prompt': `
                Generate a sad music  melody in the key of B minor with a simple rhythm. That can be 
                imported and just played. generate full music not for 30 sec. Do not give a description
                 for the melody. 
                it should be based on ${FeelingsInput}, mood is ${MoodInput}, Atmosphere is ${AtmosphereInput},
                tempo is ${TempoInput} and discription is ${Description}.
                only in key note.
                Example are bellow 

[C E G C] [D F A G] [E G B A] [F A C E]
1   2   3   4   1   2   3   4   1   2   3   4   1   2   3   4

[C E G C] [C E G C] [G E C G] [G E C G]
1   2   3   4   1   2   3   4   1   2   3   4   1   2   3   4

[A F D A] [A F D A] [G E C G] [F D B F]
1   2   3   4   1   2   3   4   1   2   3   4   1   2   3   4
###
[C5 C5 G4 G4] [A4 A4 G4 G4] [F4 F4 E4 E4] [E4 E4 D4 D4]
1    2    3    4     1    2    3    4     1    2    3    4     1    2    3    4

[C G] [A G] [F E] [D C] [C G] [A G] [F E] [D C]
1   2   3   4   1   2   3   4   1   2   3   4

[C C] [G G] [A A] [G G] [F F] [E E] [D D] [C C]
1   2   3   4   1   2   3   4   1   2   3   4

###
Note: remove brackets and numbers , display only alphabets..
        `,
                'max_tokens': 500,
                'temperature': 0.7
            })
        });
        const data = await response.json();
        setTimeout(function () {
            note_output.innerText = data.choices[0].text.trim();
            fetchImageUrl(Title);
        }, 2000);
    } catch (error) {
        console.log("Error:", error);
    }
}

async function fetchImageUrl(Title) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY4}`
        },
        body: JSON.stringify({
            prompt: `Provide a creative and artistic image for the given title ${Title}`,
            n: 1,
            size: '512x512',
            response_format: 'b64_json'
        })
    };
    await fetchAPI(url1, requestOptions)
        .then(response => response.json())
        .then(data => {
            // const imageData = data.data[0].b64_json;
            if (data.data && data.data.length > 0) {
                img_output.innerHTML = `<img src="data:image/png;base64,${data.data[0].b64_json}">`;
            }

        })
}

// Helper function to handle fetch and rate limits
async function fetchAPI(url, options) {
    const response = await fetch(url, options);
    if (response.status === 429) {
        // Handle rate limit by waiting and retrying the request after a delay
        const retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
        await sleep(retryAfter * 2000);
        console.log("hello")
        return fetchAPI(url, options); // Retry the request
    }
    return response;
}

// Helper function to introduce delay using setTimeout
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


