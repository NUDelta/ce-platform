export const cn = () => {

    let title = 'Murder Mystery'
    let description = "You've been invited to participate in a murder mystery!"
    let notification = 'Help us catch a killer!'
    let setting = ['coffee', 'at a coffee shop']
    let templates = ['CNstart', 'CNchat']
    let questions = []
    let characters = []
    let prompts = []

    let question1 = {
        question: 'Name an interesting option on the menu',
        responseType: 'text',
        responseData: 'menu'
    }

    let question2 = {
        question: 'What did you order?',
        responseType: 'text',
        responseData: 'order'
    }

    let question3 = {
        question: 'How busy is the coffee shop right now?',
        responseType: 'dropdown',
        responseData: ['not busy at all', 'a little busy', 'somewhat busy', 'pretty busy', 'very busy']
    }

    questions = [question1, question2, question3]

    let char1 = {
        roleName: 'murderer',
        instruction: 'Try to avoid being caught and weasel your way out of the clues!',
        context: ['very busy']
    }

    let char2 = {
        roleName: 'innocent',
        instruction: 'Try to prove your innocence and find the real murderer!',
        context: ['not busy at all', 'a little busy', 'somewhat busy', 'pretty busy']
    }

    characters = [char1, char2]

    let prompt1 = {
        prompt: 'We have our first clue. The murderer is in a very busy coffee shop!',
        info: '',
        timing: 3 //seconds after casting occurs
    }

    let prompt2 = {
        prompt: "Here's the second clue. The murderer ordered ",
        info: 'order',
        timing: 6
    }

    let prompt3 = {
        prompt: "Here's the last clue. The murderer is in a coffee shop that sells ",
        info: 'menu',
        timing: 9,  
    }

    let prompt4 = {
        prompt: "Now it's time to cast your vote! Who do you think the murderer is?",
        info: '',
        timing: 12
    }

    let prompt5 = {
        prompt: "Now that your votes are cast, let's find out who's right. The murderer is ",
        info: 'user',
        timing: 15
    }

    prompts = [prompt1, prompt2, prompt3, prompt4, prompt5]

    return [title, description, notification, setting, templates, questions, characters, prompts];

}