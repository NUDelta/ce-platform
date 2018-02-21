import sys
import requests
import time

path1 = [(43, -87), (32, -120)]

park =  (42.056838, -87.675940)
burgers = (42.046131, -87.681559)
grocery = (42.047621, -87.679488)

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


if __name__ == "__main__":
