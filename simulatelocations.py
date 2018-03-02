import sys
import requests
import time

path1 = [(43, -87), (32, -120)]

park =  (42.056838, -87.675940)
burgers = (42.046131, -87.681559)
grocery = (42.047621, -87.679488)
coffee = (42.046881, -87.679555)

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
    #print uid + "at location " + str(location[0]) + " " + str(location[1])

#This test checks that users receive experiences when they get an affordance
#   and then loose the correct experiences when they loose the affordance
def basicUserMovement():
	print "Log in as all users"
	#time.sleep(10)
	setLocation(park, sys.argv[1])
	print "User A should now have two experiences, participate in scavenger hunt"
	print "after participating, user A should only have restaurant!"

	time.sleep(20)
	setLocation(park, sys.argv[2])
	print "user B should now have two experiences"

	time.sleep(20)
	setLocation(burgers, sys.argv[2])
	print "user B should now have one experience"

def threeUsersMoving():
	print "Log in as all users"
	time.sleep(5)
	setLocation(park, sys.argv[1])
	print "User A should now have two experiences"

	time.sleep(20)
	setLocation(park, sys.argv[2])
	print "user B should now have two experiences"

	time.sleep(20)
	setLocation(burgers, sys.argv[2])
	print "user B should now have one experience"

	time.sleep(20)
	setLocation(park, sys.argv[3])
	print "user C should now have two experiences"

	time.sleep(20)
	setLocation(park, sys.argv[2])
	print "user B changes locations but should not gain experiences"

def userWaitsBetweenNotifications():
	print "Log in as all users"
	time.sleep(5)
	setLocation(park, sys.argv[1])
	print "User A should now have two experiences"
	print "Participate in one experience"
	time.sleep(20)
	print "participation should be done by now"
	print "User should not regain experiences"
	setLocation(park, sys.argv[1])

	time.sleep(50)
	setLocation(park, sys.argv[1])
	print "User should regain experience!"

def threeUsersParticipateInExperiences():
	print "Log in as all users"
	time.sleep(5)
	setLocation(park, sys.argv[1])
	print "User A should now have two experiences"
	print "Participate in scavenger hunt"
	time.sleep(10)

	setLocation(park, sys.argv[2])
	print "User B should now have two experiences"
	print "Participate in scavenger hunt and restaurant"
	time.sleep(20)

	# setLocation(park, sys.argv[3])
	# print "User C should now have one experiences"
	# time.sleep(10)

	# setLocation(park, sys.argv[1])
	# print "User A should have one experiences"
	# print "Participate in restaurant"
	# time.sleep(10)

	# setLocation(burgers, sys.argv[2])
	# print "User B should have no experiences"
	# time.sleep(5)

	setLocation(burgers, sys.argv[3])
	print "User C should only have scavenger hunt"
	time.sleep(10)

	print "yay it all worked!!"

def oneUserMoving():
    print "Log in as user a"
    time.sleep(2)
    setLocation(park, sys.argv[1])
    print "location set to park"

    time.sleep(2)
    setLocation((42.056836, -87.675941), sys.argv[1])
    print "slight movement 1"

    time.sleep(2)
    setLocation((42.056830, -87.67595), sys.argv[1])
    print "slight movement 2"

    time.sleep(2)
    setLocation((42.056835, -87.675942), sys.argv[1])
    print "slight movement 3"

    time.sleep(2)
    setLocation((42.05684, -87.67593), sys.argv[1])
    print "slight movement 4"

    time.sleep(2)
    setLocation((42.05685, -87.67592), sys.argv[1])
    print "slight movement"


def allUsersAtPark():
    print "Log in as all users"
    time.sleep(5)
    setLocation(park, sys.argv[1])
    print "location set to park for user a"

    time.sleep(5)
    setLocation(park, sys.argv[2])
    print "location set to park for user b"

    time.sleep(5)
    setLocation(park, sys.argv[3])
    print "location set to park for user c"

def allUsersAtRestaurant():
    setLocation(burgers, sys.argv[1])
    setLocation(burgers, sys.argv[2])
    setLocation(burgers, sys.argv[3])
    print "all users at burgers"
    setLocation(burgers, sys.argv[1])
    setLocation(burgers, sys.argv[2])
    setLocation(burgers, sys.argv[3])
    print "all users at burgers"



if __name__ == "__main__":
	allUsersAtRestaurant()
