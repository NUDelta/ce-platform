"""From directory of this file, call for example

python -m unittest test_db_links
"""
import unittest
import sys
sys.path.insert(0, '..')
from db import setup_db
from production_config import CONFIG
from pprint import pprint, pformat

setup_db_name = None
setup_db_name = CONFIG['setup_db_name']
db = setup_db(setup_db_name)
print(db)
users = [user for user in db['users'].find({})]
print(users)

print(f"Running test_db_links for {setup_db_name} database...")

class TestDatabaseLinks(unittest.TestCase):

    def test_submissions_should_match_experience_needs(self):
        """ the number of submissions should match the number needed for each need specified in the experience
        Note: This checks if submissions correspond to the specified needs in an experience,
        but not the other way around
        """
        experiences = [exp for exp in db['experiences'].find({})]
        for exp in experiences:
            for need in exp['contributionTypes']:
                cur = db['submissions'].find({
                    'needName': need['needName'],
                    'eid': exp['_id']
                })
                subs = [sub for sub in cur]
                eid = exp['_id']
                needName = need['needName'],
                numberNeeded = need['numberNeeded']
                with self.subTest(eid=eid, needName=needName, numberNeeded=numberNeeded):
                    self.assertEqual(
                        numberNeeded, len(subs),
                        'Could not find corresponding submissions for experience need. Hint: {hint}'.format(
                            hint='In `updateOCE` in the `createNewExperiences.js` file, NOTE: you must run Meteor' +
                                 'call updateSubmissionNeedName in addition to this function'
                        ))

    def test_submissions_should_match_incident_needs(self):
        """ the number of submissions should match the number needed for each need specified in the incident
        Note: This checks if submissions correspond to the specified needs in an incident,
        but not the other way around
        """
        incidents = [exp for exp in db['incidents'].find({})]
        for incident in incidents:
            for need in incident['contributionTypes']:
                cur = db['submissions'].find({
                    'needName': need['needName'],
                    'iid': incident['_id']
                })
                subs = [sub for sub in cur]
                iid = incident['_id']
                needName = need['needName'],
                numberNeeded = need['numberNeeded']
                with self.subTest(iid=iid, needName=needName, numberNeeded=numberNeeded):
                    self.assertEqual(
                        numberNeeded, len(subs),
                        'Could not find corresponding submissions for incident need. Hint: {hint}'.format(
                           hint='In `updateOCE` in the `createNewExperiences.js` file, NOTE: you must run Meteor' +
                                'call updateSubmissionNeedName in addition to this function'
                        ))

    def test_incident_needs_should_match_submission_needs_for_incident(self):
        """ the needs listed in incident contributionTypes should match the corresponding needs that have already been
        submitted. We check only for incidents, because current callbacks (Half Half, Storytime) change the needs in an
        incident only """
        incidents = [exp for exp in db['incidents'].find({})]
        for exp in incidents:
            cur = db['submissions'].find({
                'iid': exp['_id']
            })

            needNames = [sub['needName'] for sub in cur]
            uniqueNeedNames = list(set(needNames))
            for needName in uniqueNeedNames:
                with self.subTest(needName=needName):
                    el = [need for need in exp['contributionTypes'] if need['needName'] == needName]
                    found_one_need = len(el) == 1
                    self.assertTrue(found_one_need, 'Incident ({iid}) did not have needName ({needName}) found in corresponding submissions'.format(iid=exp['_id'], needName=needName))

    def test_availability_should_match_incident_needs(self):
        incidents = [exp for exp in db['incidents'].find({})]
        for exp in incidents:
            availability = db['availability'].find_one({
                '_id': exp['_id']
            })
            for need in exp['contributionTypes']:
                iid = exp['_id']
                needName = need['needName']
                with self.subTest(iid=iid, needName=needName):
                    el = [needMap for needMap in availability['needUserMaps'] if needMap["needName"] == needName]
                    found_one_need = len(el) == 1
                    self.assertTrue(found_one_need, f'Availability ({iid}) did not have needName ({needName})')

    def test_assignments_should_match_incident_needs(self):
        incidents = [exp for exp in db['incidents'].find({})]
        for exp in incidents:
            availability = db['assignments'].find_one({
                '_id': exp['_id']
            })
            for need in exp['contributionTypes']:
                iid = exp['_id']
                needName = need['needName']
                with self.subTest(iid=iid, needName=needName):
                    el = [needMap for needMap in availability['needUserMaps'] if needMap["needName"] == needName]
                    found_one_need = len(el) == 1
                    self.assertTrue(found_one_need, f'Assignments ({iid}) did not have needName ({needName})')

    def test_detectors_should_match_experience_needs(self):
        """ the situation.detector in each need should correspond to an actual id in the detector collection """
        experiences = [exp for exp in db['experiences'].find({})]
        for exp in experiences:
            for need in exp['contributionTypes']:
                detector_id = need['situation']['detector']
                detector = db['detectors'].find_one({'description': detector_id})
                eid = exp['_id']
                needName = need['needName']
                with self.subTest(eid=eid, needName=needName, detector_id=detector_id):
                    self.assertIsNotNone(
                        detector,
                        f'Could not find detector matching experience needs')

    def test_detectors_should_match_incident_needs(self):
        """ the situation.detector in each iid need should correspond to an actual id in the detector collection """
        incidents = [incident for incident in db['incidents'].find({})]
        for incident in incidents:
            for need in incident['contributionTypes']:
                detector_id = need['situation']['detector']
                detector = db['detectors'].find_one({'description': detector_id})
                iid = incident['_id']
                needName = need['needName']
                with self.subTest(iid=iid, needName=needName, detector_id=detector_id):
                    self.assertIsNotNone(
                        detector,
                        f'Could not find detector matching incident needs')

    def test_activeIncidents_should_match_assignments(self):
        return # we no longer have this syncing issue after changing how the db works
        assignments = [ass for ass in db['assignments'].find({})]
        users = [user for user in db['users'].find({})]

        for user in users:
            uid = user['_id']
            
            # keep track of activeIncidents that assignments believes
            incidents_active_acc_to_ass = set() 

            for ass in assignments:
                iid = ass['_id']
                for needMap in ass['needUserMaps']:
                    # e.g., {"needName" : "Book Buddies 4","users" : [{"uid" : "9NnJBZ5rxTQKp5L5B"},{"uid" : "zQNjqLKfS857u2LCk"}]}
                    for needMapUser in needMap['users']:
                        if needMapUser['uid'] == user['_id']:
                            # keep track of activeIncidents that assignments believes
                            incidents_active_acc_to_ass.add(iid) 

            profileActiveIncidents = set(user['profile']['activeIncidents'])
            assignmentComputedActiveIncidents = incidents_active_acc_to_ass
            with self.subTest(uid=uid, profileActiveIncidents=profileActiveIncidents, assignmentComputedActiveIncidents=assignmentComputedActiveIncidents):
                self.assertEqual(profileActiveIncidents, assignmentComputedActiveIncidents,
                        'profile.activeIncidents and the active incidents computed by assignments are out of sync')

    def test_participating_now_should_match_incident_needs(self):

        for incident in db['incidents'].find({}):
            iid = incident['_id']
            with self.subTest(iid=iid):
                pnow_incident = db['participating_now'].find_one({"_id": incident["_id"]})
                self.assertIsNotNone(pnow_incident, 'Did not find corresponding participating now document for incident')
                self.assertIn('needUserMaps', pnow_incident)
                needNames = [need['needName'] for need in incident['contributionTypes']]
                for needMap in pnow_incident['needUserMaps']:
                    self.assertIn(needMap['needName'], needNames,
                            'Did not find need {} from needMap in incident need names'.format(needMap['needName']))

                needNamesOfMaps = [need['needName'] for need in pnow_incident['needUserMaps']]
                for needName in needNames:
                    self.assertIn(needName, needNamesOfMaps,
                            f'Did not find need from incident {needName} in needMaps')


