from bs4 import BeautifulSoup
import requests as req
import csv
import re

#url = "https://transcripts.foreverdreaming.org/viewtopic.php?t=154723"
#List of directory pages that link to the episodes we want (seasons 10-13)
urls = ["https://transcripts.foreverdreaming.org/viewforum.php?f=1457&sk=s&start=546",
        "https://transcripts.foreverdreaming.org/viewforum.php?f=1457&sk=s&start=624",
        "https://transcripts.foreverdreaming.org/viewforum.php?f=1457&sk=s&start=702"]

#array to hold list of urls for individual episodes
episodeURLs = []
#string that will be used to build the episode urls
urlBase = "https://transcripts.foreverdreaming.org"

#Get list of all episode transcript urls we need:
for url in urls:
    html_doc = req.get(url)

    if html_doc:
         S = BeautifulSoup(html_doc.content, 'html.parser')
         linkList = S.find_all('a', class_="topictitle", href=True)

         for link in linkList:
             #check the title to see if the episode is part of the seasons we want (10-13)
             if(link.getText()[:3] in ["10x", "11x", "12x", "13x"]):
                urlPart = link['href']

                # strip out extra stuff we don't need at the end
                x = urlPart.find('&')
                urlPart = urlPart[1:x]

                # add it to the array
                episodeURLs.append(urlPart)

# open the csv so we can write data          
with open('pokemonDP.csv', mode='w', newline='', encoding='utf-8') as data_file:
    #set up csv and prep for writing
    data_writer = csv.writer(data_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    data_writer.writerow(["season", "episode", "line", "character", "dialogue"])

    # loop thrugh the url components in episodeURLs
    for url in episodeURLs:
        # get the full url
        fullUrl = urlBase + url
        print(fullUrl)

        episode_html_doc = req.get(fullUrl)

        if episode_html_doc:
            ES = BeautifulSoup(episode_html_doc.content, 'html.parser')

            #Get the episode title
            titleString = ES.find('title')
            titleString = titleString.getText()
            print("Scraping: " + titleString)

            #Extract the season and episode numbers from the doc
            i = titleString.find('x')       #index markers to split of season and episode number of format NNxNN
            j = titleString.find(' ')
            season = titleString[:i]
            episode = titleString[i+1:j]

            #retrive the content and compress it into one long string
            # there are no html markers to mark dialogue and we don't want to deal with the <br> tags that are in there
            bodyString = ES.find('div', class_="content")
            bodyString = ' '.join(ES.find('div', class_="content").stripped_strings)

            if bodyString is not None:

                #pick out ALLCAPS followed by : using regex
                # Update: Now pick out all caps strings that start with a letter, end with a colon, and potentially
                # contain bracketed conclusions, or extra '.', ',', or ' ' characters at the end, as well as
                # having '&' or "'" in the string body.
                pattern = re.compile("[A-Z][A-Z&,() ']*\[?[A-Z ]*\]?[A-Z., ]?[A-Z., ]?:")

                dialogueCount = 0       #variable to keep track of number of dialogue lines for ordering

                allSpeakers = re.finditer(pattern, bodyString)

                speakerIndexes = []
                for speaker in allSpeakers:
                    #store the start and end indexes of all speakers in an array
                    speakerIndexes.append([speaker.start(), speaker.end()]) 

                #print(speakerIndexes)

                for k in range(len(speakerIndexes)):
                    #Extract speaker and dialogue from the 
                    speakerName = bodyString[int(speakerIndexes[k][0]):int(speakerIndexes[k][1]) - 1] #-1 gets rid of ':'
                    
                    #for dialogue, +1 gets rid of leading space
                    if k < len(speakerIndexes) -1:
                        dialogue = bodyString[int(speakerIndexes[k][1])+1:int(speakerIndexes[k+1][0])]
                    else:
                        # for the last piece of dialogue, take everything until the end
                        dialogue = bodyString[int(speakerIndexes[k][1])+1:-1]

                    print("LOG: " + season + " " + episode + " " + str(dialogueCount) + " " + speakerName + " " + dialogue)
                    data_writer.writerow([season, episode, dialogueCount, speakerName, dialogue])

                    #iterate the dialogueCount
                    dialogueCount = dialogueCount + 1


'''
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
'''




