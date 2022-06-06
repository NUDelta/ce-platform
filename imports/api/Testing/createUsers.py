import json


f = open('users.txt')
users = {}

def createProfile(name1, pair, lastname1 = ""):
    return{
        "username": name1.lower(),
        "email": "{}@email.com".format(name1),
        "password": "password",
        "profile": {
            "firstName": name1,
            "lastName": lastname1,
            "staticAffordances": {
                pair: True
            }
        }}

pairCounter = 1
for ind, line in enumerate(f.readlines()):
    
    arr = line.strip("\n").split(" ")
    print(arr)
    if len(arr) == 4:
        [name1, lastname1, name2, lastname2] = arr
    else:
        [name1, name2] = arr
    users[name1.lower()] = createProfile(name1, "pair" + str(pairCounter), lastname1)
    users[name2.lower()] = createProfile(name2, "pair" + str(pairCounter), lastname2)
    pairCounter += 1

json_object = json.dumps(users)
with open("GeneratedUSER.js", "w") as outfile:
    outfile.write("export let USERS = " + json_object)