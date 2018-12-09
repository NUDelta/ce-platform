import sys
import requests
import time

path1 = [(43, -87), (32, -120)]

park =  (42.056838, -87.675940)
burgers = (42.046131, -87.681559)
grocery = (42.047621, -87.679488)
grocery2 = (42.039818,-87.680088)
coffee = (42.046881, -87.679555)
beer = (42.047105, -87.682006)
sydney = (-33, 151)
train = (42.053872,-87.683748)
brisbane = (-37.822464, 144.966146)
library = (42.0484004, -87.6802257) #This is working!!!


def followPath(path, uid):
	for stop in path:
	    setLocation(stop, uid)
	    time.sleep(1)

def setLocation(location, uid):

	local = "http://localhost:3000/"
	herok = "https://staging-ce-platform.herokuapp.com/"
	
	r = requests.post(local + "api/geolocation", json={
	            "userId": uid,
	            "location": {
	                "coords": {
                        "latitude": location[0],
                        "longitude": location[1]
	                },
	                "activity": {"type": "unknown", "confidence": 100}
                }
	        })
    #print(uid + "at location " + str(location[0]) + " " + str(location[1]))


# db.locations.update(
#    { uid: "kTwXH8rAHeutLDD83" },
#    { "$set": {"affordances.sunset": true}}
# )
#This test checks that users receive experiences when they get an affordance
#   and then loose the correct experiences when they loose the affordance
def basicUserMovement():
	print("Log in as all users")
	#time.sleep(10)
	setLocation(park, sys.argv[1])
	print("User A should now have two experiences, participate in scavenger hunt")
	print("after participating, user A should only have restaurant!")

	time.sleep(20)
	setLocation(park, sys.argv[2])
	print("user B should now have two experiences")

	time.sleep(20)
	setLocation(burgers, sys.argv[2])
	print("user B should now have one experience")

def threeUsersMoving():
	print("Log in as all users")
	time.sleep(5)
	setLocation(park, sys.argv[1])
	print("User A should now have two experiences")

	time.sleep(20)
	setLocation(park, sys.argv[2])
	print("user B should now have two experiences")

	time.sleep(20)
	setLocation(burgers, sys.argv[2])
	print("user B should now have one experience")

	time.sleep(20)
	setLocation(park, sys.argv[3])
	print("user C should now have two experiences")

	time.sleep(20)
	setLocation(park, sys.argv[2])
	print("user B changes locations but should not gain experiences")

def userWaitsBetweenNotifications():
	print("Log in as all users")
	time.sleep(5)
	setLocation(park, sys.argv[1])
	print("User A should now have two experiences")
	print("Participate in one experience")
	time.sleep(20)
	print("participation should be done by now")
	print("User should not regain experiences")
	setLocation(park, sys.argv[1])

	time.sleep(50)
	setLocation(park, sys.argv[1])
	print("User should regain experience!")

def threeUsersParticipateInExperiences():
	print("Log in as all users")
	time.sleep(5)
	setLocation(park, sys.argv[1])
	# time.sleep(10)

	setLocation(park, sys.argv[2])
	# time.sleep(20)

	# setLocation(park, sys.argv[3])
	# print("User C should now have one experiences")
	# time.sleep(10)

	# setLocation(park, sys.argv[1])
	# print("User A should have one experiences")
	# print("Participate in restaurant")
	# time.sleep(10)

	# setLocation(burgers, sys.argv[2])
	# print("User B should have no experiences")
	# time.sleep(5)

	setLocation(burgers, sys.argv[3])
	# time.sleep(10)

def oneUserMoving():
    print("Log in as user a")
    time.sleep(2)
    setLocation(park, sys.argv[1])
    print("location set to park")

    time.sleep(2)
    setLocation((42.056836, -87.675941), sys.argv[1])
    print("slight movement 1")

    time.sleep(2)
    setLocation((42.056830, -87.67595), sys.argv[1])
    print("slight movement 2")

    time.sleep(2)
    setLocation((42.056835, -87.675942), sys.argv[1])
    print("slight movement 3")

    time.sleep(2)
    setLocation((42.05684, -87.67593), sys.argv[1])
    print("slight movement 4")

    time.sleep(2)
    setLocation((42.05685, -87.67592), sys.argv[1])
    print("slight movement")

def test5():
	while(True):
		print("josh goes to the train")
		setLocation(train, sys.argv[5])
		time.sleep(15)

		print("garrett gets to the grocery store")
		setLocation(grocery, sys.argv[1])
		print("meg gets to the bar")
		setLocation(beer, sys.argv[3])
		time.sleep(15)

		print("garretts brother gets to the grocery store")
		setLocation(grocery, sys.argv[2])
		time.sleep(15)

		print("megs sister gets to the bar")
		setLocation(beer, sys.argv[4])
		time.sleep(15)

		print("josh gets to the park")
		setLocation(park, sys.argv[5])
		time.sleep(15)

		print("meg and her sister goes to the train")
		setLocation(train, sys.argv[3])
		setLocation(train, sys.argv[4])
		time.sleep(15)

		print("garrett goes to a park")
		setLocation(park, sys.argv[1])
		time.sleep(15)

		print("garrett goes to the train")
		setLocation(train, sys.argv[1])
		time.sleep(15)

def allUsersAtPark():
	setLocation(park, sys.argv[1])
	setLocation(park, sys.argv[2])
	setLocation(park, sys.argv[3])
	setLocation(park, sys.argv[4])
	setLocation(park, sys.argv[5])
	print("all usrs at parks")

def allUsersAtCastle():
	setLocation((42.050538,-87.677355), sys.argv[1])
	setLocation((42.050538,-87.677355), sys.argv[2])
	setLocation((42.050538,-87.677355), sys.argv[3])
	setLocation((42.050538,-87.677355), sys.argv[4])
	setLocation((42.050538,-87.677355), sys.argv[5])
	print("all usrs at castle")

def allUsersAtRestaurant():
	setLocation(burgers, sys.argv[1])
	setLocation(burgers, sys.argv[2])
	setLocation(burgers, sys.argv[3])
	setLocation(burgers, sys.argv[4])
	setLocation(burgers, sys.argv[5])
	print("all users at burgers")

def allUsersAtCoffee():
	setLocation(coffee, sys.argv[1])
	setLocation(coffee, sys.argv[2])
	setLocation(coffee, sys.argv[3])
	setLocation(coffee, sys.argv[4])
	setLocation(coffee, sys.argv[5])
	print("all users at coffee")

def allUsersAtGrocery():
	setLocation(grocery, sys.argv[1])
	setLocation(grocery, sys.argv[2])
	setLocation(grocery, sys.argv[3])
	setLocation(grocery, sys.argv[3])
	setLocation(grocery, sys.argv[3])

	print("all users at grocery")

def allUsersAtBars():
	setLocation((42.046251, -87.680547), sys.argv[1])
	setLocation((42.046251, -87.680547), sys.argv[2])
	setLocation((42.046251, -87.680547), sys.argv[3])
	setLocation((42.046251, -87.680547), sys.argv[4])
	setLocation((42.046251, -87.680547), sys.argv[5])

	print("all users at bar")

def allUsersAtTrain():
	setLocation(train, sys.argv[1])
	setLocation(train, sys.argv[2])
	setLocation(train, sys.argv[3])
	setLocation(train, sys.argv[4])
	setLocation(train, sys.argv[5])

	print("all users at train")

def userAatCoffee():
    setLocation(coffee, sys.argv[1])

def userAatBar():
    setLocation(beer, sys.argv[1])

def userAatGrocery():
    setLocation(grocery, sys.argv[1])

def allUsersCalifornia():
	setLocation((34, -120), sys.argv[1])
	setLocation((34, -120), sys.argv[2])
	setLocation((34, -120), sys.argv[3])
	setLocation((34, -120), sys.argv[4])
	setLocation((34, -120), sys.argv[5])

	print("all users in CA")

def allUsersSyd():
	setLocation(sydney, sys.argv[1])
	setLocation(sydney, sys.argv[2])
	setLocation(sydney, sys.argv[3])
	setLocation(sydney, sys.argv[4])
	setLocation(sydney, sys.argv[5])

	print("all users in sydney")

def allUsersLakefill():
	setLocation((42.052460,-87.669876), sys.argv[1])
	setLocation((42.052460,-87.669876), sys.argv[2])
	setLocation((42.052460,-87.669876), sys.argv[3])
	setLocation((42.052460,-87.669876), sys.argv[4])
	setLocation((42.052460,-87.669876), sys.argv[5])

	print("all users in lakefill")

def onlyGarretAtLake():
	setLocation((42.052460,-87.669876), sys.argv[1])
	setLocation(train, sys.argv[2])
	setLocation(train, sys.argv[3])
	setLocation(train, sys.argv[4])
	setLocation(train, sys.argv[5])

	print("only garrett at lakefill")

def garrettAndMegBump():
    setLocation(grocery, sys.argv[1])
    setLocation(grocery, sys.argv[3])
    setLocation(train, sys.argv[2])
    setLocation(train, sys.argv[4])
    setLocation(train, sys.argv[5])

    print("meg and garret at grocery")

def allUsersGrocery():
    setLocation(grocery, sys.argv[1])
    setLocation(grocery, sys.argv[2])
    setLocation(grocery, sys.argv[3])
    setLocation(grocery, sys.argv[4])
    setLocation(grocery, sys.argv[5])

    print("all users at grocery")

def allUsersLib():
    setLocation(library, sys.argv[1])
    setLocation(library, sys.argv[2])
    setLocation(library, sys.argv[3])
    setLocation(library, sys.argv[4])
    setLocation(library, sys.argv[5])

    print("all users at library")

if __name__ == "__main__":
    #allUsersGrocery()
	#allUsersAtRestaurant()
	allUsersAtCoffee()
	#allUsersLib()
    #garrettAndMegBump()
    #time.sleep(2)
    #onlyGarretAtLake()
