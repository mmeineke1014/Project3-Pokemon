import csv

def character_corpus(unique_characters, person_text_pairings):
    chars = ["ASH","PIKACHU","DAWN","BROCK","JESSIE","JAMES","MEOWTH","PAUL","ZOEY","BARRY"]
    file = open("pokemonDP.csv")
    for line in file:
        
        script = line.split(',')
        for i in range(3,len(script)):

            character = script[i]

            if not character in chars:
                continue

            character = character.removeprefix("\"")
            character = character.removesuffix("\"")
            if character not in unique_characters:
                unique_characters.append(character)
                person_text_pairings[character] = []
                
            dialouge = script[4]
            dialouge = dialouge.replace("\"", "")
            dialouge = dialouge.replace("It's about you It's about me It's about hope It's about dreams It's about friends that work together To claim their destiny It's about reaching for the skies Pokemon! Given the courage And willing to try It's about never giving up So hold your head up And we will carry on... Sinnoh League Victors Pokemon!", "")
            dialouge = dialouge.replace("!","")
            dialouge = dialouge.replace(".","")
            dialouge = dialouge.replace("?","")
            dialouge = dialouge.strip()
            person_text_pairings[character].append(dialouge)
    return person_text_pairings

def dialouge_count(pairings):
    bad_words = ["The", "Wow", "But", "And", "All right", "Hey", "Yeah", "Okay", "Well", "Now", "Whoa", "Oh", "So", "No"]
    count_of = {}
    character_counts = {}
    for keys in pairings:
        for dialouge in pairings[keys]:
            if not dialouge in count_of:
                if not dialouge in bad_words:
                    count_of[dialouge] = 1
            else:
                count_of[dialouge] += 1
        
        sorted_counts = sorted(count_of.items(), key=lambda x:x[1], reverse=True)
        character_counts[keys] = sorted_counts[0:20]
        count_of = {}
    return character_counts


def main():
    unique_characters = []
    person_text_pairings = {}

    with open("char_dialouge.csv", "w", newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Character", "Dialouge", "Amount"])

        pairings = character_corpus(unique_characters, person_text_pairings)
        counted = dialouge_count(pairings)
        #sorted_footballers_by_goals = sorted(footballers_goals.items(), key=lambda x:x[1])
        for keys in counted:
            for dialouge in counted[keys]:
                combo = [keys, dialouge[0], dialouge[1]]
                writer.writerow(combo)



main()