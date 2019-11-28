export const MurderMystery = () => {
    let title = 'Murder Mystery';
    let setting = ['coffee', 'at a coffee shop'];
    let question1 = {
        question: 'How busy is the coffee shop right now?',
        responseType: 'dropdown',
        responseData: ['not busy at all', 'a little busy', 'somewhat busy', 'pretty busy', 'very busy']
    }
    let question2 = {
        question: 'What did you order?',
        responseType: 'text',
        responseData: 'order'
    }
    let char1 = {
        roleName: 'murderer',
        instruction: 'Try to avoid being caught and weasel your way out of the clues!',
        context: max(question1.responseData)
    }
    let char2 = {
        roleName: 'innocent',
        instruction: 'Try to prove your innocence and find the real murderer!',
        context: !max(question1.responseData)
    }
    let characters = [char1, char2];
    let prompt1 = {
        prompt: 'We have our first clue. The murderer is in a ' + murderer.question1.responseData + ' coffee shop!',
        timing: 10 //seconds after casting occurs
    }
    let prompt2 = {
        prompt: "Here's the second clue. The murderer ordered " + murderer.question2.responseData,
        timing: 80
    }
    let prompts = [prompt1, prompt2, prompt3, prompt4, prompt5];
    return [title, description, notification, setting, templates, questions, characters, prompts];
}

