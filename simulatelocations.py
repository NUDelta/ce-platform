import sys
import requests
import time

path1 = [(43, -87), (32, -120)]

park =  (42.056838, -87.675940)
burgers = (42.046131, -87.681559)
grocery = (42.047621, -87.679488)
coffee = (42.046881, -87.679555)
beer = (42.047105, -87.682006)
sydney = (-33, 151)
train = (42.053872,-87.683748)
brisbane = (-37.822464, 144.966146)


def followPath(path, uid):
	for stop in path:
	    setLocation(stop, uid)
	    time.sleep(1)

def setLocation(location, uid):
	r = requests.post("http://localhost:3000/api/geolocation", json={
	            "userId": uid,
	            "location": {"coords": {
	                "latitude": location[0],
	                "longitude": location[1]
	            }}
	        })
    ## uid + "at location " + str(location[0]) + " " + str(location[1])


# db.locations.update(
#    { uid: "kTwXH8rAHeutLDD83" },
#    { "$set": {"affordances.sunset": true}}
# )
#This test checks that users receive experiences when they get an affordance
#   and then loose the correct experiences when they loose the affordance
def basicUserMovement():
	# "Log in as all users"
	#time.sleep(10)
	setLocation(park, sys.argv[1])
	# "User A should now have two experiences, participate in scavenger hunt"
	# "after participating, user A should only have restaurant!"

	time.sleep(20)
	setLocation(park, sys.argv[2])
	# "user B should now have two experiences"

	time.sleep(20)
	setLocation(burgers, sys.argv[2])
	# "user B should now have one experience"

def threeUsersMoving():
	# "Log in as all users"
	time.sleep(5)
	setLocation(park, sys.argv[1])
	# "User A should now have two experiences"

	time.sleep(20)
	setLocation(park, sys.argv[2])
	# "user B should now have two experiences"

	time.sleep(20)
	setLocation(burgers, sys.argv[2])
	# "user B should now have one experience"

	time.sleep(20)
	setLocation(park, sys.argv[3])
	# "user C should now have two experiences"

	time.sleep(20)
	setLocation(park, sys.argv[2])
	# "user B changes locations but should not gain experiences"

def userWaitsBetweenNotifications():
	# "Log in as all users"
	time.sleep(5)
	setLocation(park, sys.argv[1])
	# "User A should now have two experiences"
	# "Participate in one experience"
	time.sleep(20)
	# "participation should be done by now"
	# "User should not regain experiences"
	setLocation(park, sys.argv[1])

	time.sleep(50)
	setLocation(park, sys.argv[1])
	# "User should regain experience!"

def threeUsersParticipateInExperiences():
	# "Log in as all users"
	time.sleep(5)
	setLocation(park, sys.argv[1])
	# time.sleep(10)

	setLocation(park, sys.argv[2])
	# time.sleep(20)

	# setLocation(park, sys.argv[3])
	# # "User C should now have one experiences"
	# time.sleep(10)

	# setLocation(park, sys.argv[1])
	# # "User A should have one experiences"
	# # "Participate in restaurant"
	# time.sleep(10)

	# setLocation(burgers, sys.argv[2])
	# # "User B should have no experiences"
	# time.sleep(5)

	setLocation(burgers, sys.argv[3])
	# time.sleep(10)

def oneUserMoving():
    # "Log in as user a"
    time.sleep(2)
    setLocation(park, sys.argv[1])
    # "location set to park"

    time.sleep(2)
    setLocation((42.056836, -87.675941), sys.argv[1])
    # "slight movement 1"

    time.sleep(2)
    setLocation((42.056830, -87.67595), sys.argv[1])
    # "slight movement 2"

    time.sleep(2)
    setLocation((42.056835, -87.675942), sys.argv[1])
    # "slight movement 3"

    time.sleep(2)
    setLocation((42.05684, -87.67593), sys.argv[1])
    # "slight movement 4"

    time.sleep(2)
    setLocation((42.05685, -87.67592), sys.argv[1])
    # "slight movement"

def test5():
	while(True):
		# "josh goes to the train"
		setLocation(train, sys.argv[5])
		time.sleep(15)

		# "garrett gets to the grocery store"
		setLocation(grocery, sys.argv[1])
		# "meg gets to the bar"
		setLocation(beer, sys.argv[3])
		time.sleep(15)

		# "garretts brother gets to the grocery store"
		setLocation(grocery, sys.argv[2])
		time.sleep(15)

		# "megs sister gets to the bar"
		setLocation(beer, sys.argv[4])
		time.sleep(15)

		# "josh gets to the park"
		setLocation(park, sys.argv[5])
		time.sleep(15)

		# "meg and her sister goes to the train"
		setLocation(train, sys.argv[3])
		setLocation(train, sys.argv[4])
		time.sleep(15)

		# "garrett goes to a park"
		setLocation(park, sys.argv[1])
		time.sleep(15)

		# "garrett goes to the train"
		setLocation(train, sys.argv[1])
		time.sleep(15)

def allUsersAtPark():
	setLocation(park, sys.argv[1])
	setLocation(park, sys.argv[2])
	setLocation(park, sys.argv[3])
	setLocation(park, sys.argv[4])
	setLocation(park, sys.argv[5])
	# "all usrs at parks"

def allUsersAtCastle():
	setLocation((42.050538,-87.677355), sys.argv[1])
	setLocation((42.050538,-87.677355), sys.argv[2])
	setLocation((42.050538,-87.677355), sys.argv[3])
	setLocation((42.050538,-87.677355), sys.argv[4])
	setLocation((42.050538,-87.677355), sys.argv[5])
	# "all usrs at castle"

def allUsersAtRestaurant():
    setLocation(burgers, sys.argv[1])
    setLocation(burgers, sys.argv[2])
    setLocation(burgers, sys.argv[3])
    # "all users at burgers"


def allUsersAtGrocery():
	setLocation(grocery, sys.argv[1])
	setLocation(grocery, sys.argv[2])
	setLocation(grocery, sys.argv[3])
	setLocation(grocery, sys.argv[3])
	setLocation(grocery, sys.argv[3])

	# "all users at grocery"

def allUsersAtBars():
	setLocation((42.046251, -87.680547), sys.argv[1])
	setLocation((42.046251, -87.680547), sys.argv[2])
	setLocation((42.046251, -87.680547), sys.argv[3])
	setLocation((42.046251, -87.680547), sys.argv[4])
	setLocation((42.046251, -87.680547), sys.argv[5])

	# "all users at bar"

def allUsersAtTrain():
	setLocation(train, sys.argv[1])
	setLocation(train, sys.argv[2])
	setLocation(train, sys.argv[3])
	setLocation(train, sys.argv[4])
	setLocation(train, sys.argv[5])

	# "all users at train"

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

	# "all users in CA"

def allUsersSyd():
	setLocation(sydney, sys.argv[1])
	setLocation(sydney, sys.argv[2])
	setLocation(sydney, sys.argv[3])
	setLocation(sydney, sys.argv[4])
	setLocation(sydney, sys.argv[5])

	# "all users in sydney"

def allUsersLakefill():
	setLocation((42.052460,-87.669876), sys.argv[1])
	setLocation((42.052460,-87.669876), sys.argv[2])
	setLocation((42.052460,-87.669876), sys.argv[3])
	setLocation((42.052460,-87.669876), sys.argv[4])
	setLocation((42.052460,-87.669876), sys.argv[5])

	# "all users in lakefill"

def onlyGarretAtLake():
	setLocation((42.052460,-87.669876), sys.argv[1])
	setLocation(train, sys.argv[2])
	setLocation(train, sys.argv[3])
	setLocation(train, sys.argv[4])
	setLocation(train, sys.argv[5])

	# "only garrett at lakefill"


if __name__ == "__main__":
	allUsersAtRestaurant()
