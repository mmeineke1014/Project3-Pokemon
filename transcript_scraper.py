from bs4 import BeautifulSoup
import requests as req
import csv
import re

url = "https://transcripts.foreverdreaming.org/viewtopic.php?t=154723"
html_doc = req.get(url)

if html_doc:
    S = BeautifulSoup(html_doc.content, 'html.parser')
    
    titleString = S.find('title')
    titleString = titleString.getText()
    print(titleString)

    #Extract the season and episode numbers from the doc
    i = titleString.find('x')       #index markers to split of season and episode number of format NNxNN
    j = titleString.find(' ')
    season = titleString[:i]
    episode = titleString[i+1:j]

    #retrive the content and compress it into one long string
    # there are no html markers to mark dialogue and we don't want to deal with the <br> tags that are in there
    bodyString = S.find('div', class_="content")
    bodyString = ' '.join(S.find('div', class_="content").stripped_strings)   #add space at start for regexs

    #print(bodyString)

    #Set up the csv for data storage
    with open('pokemonDP.csv', mode='w', newline='') as data_file:
        data_writer = csv.writer(data_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        data_writer.writerow(["season", "episode", "line", "character", "dialogue"])

        #pick out ALLCAPS followed by : using regex
        pattern = re.compile('[A-Z][A-Z, ]*[A-Z]:')

        dialogueCount = 0       #variable to keep track of number of dialogue lines for ordering

        allSpeakers = re.finditer(pattern, bodyString)

        speakerIndexes = []
        for speaker in allSpeakers:
            #store the start and end indexes of all speakers in an array
            speakerIndexes.append([speaker.start(), speaker.end()])

        #print(speakerIndexes)

        for k in range(len(speakerIndexes)):
            #Extract speaker and dialogue from the 
            speakerName = bodyString[int(speakerIndexes[k][0]):int(speakerIndexes[k][1])]
            if k < len(speakerIndexes) -1:
                dialogue = bodyString[int(speakerIndexes[k][1]):int(speakerIndexes[k+1][0])]
            else:
                # for the last piece of dialogue, take everything until the end
                dialogue = bodyString[int(speakerIndexes[k][1]):-1]

            print("LOG: " + season + " " + episode + " " + str(dialogueCount) + " " + speakerName + " " + dialogue)
            data_writer.writerow([season, episode, dialogueCount, speakerName, dialogue])

            #iterate the dialogueCount
            dialogueCount = dialogueCount + 1





