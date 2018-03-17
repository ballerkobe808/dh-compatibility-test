import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  // temporary fields to manipulate the user records
  // change this to editId, editName, etc later
  addId: string = '';
  addName: string = '';
  addIntelligence: number = 5;
  addStrength: number = 5;
  addEndurance: number = 5;
  addSpicyFoodTolerance: number = 5;
  currentMember: any;
  modalTitle = 'Add Team Member'



  // current team seed data
  team = [
    { id: '1', name: 'Eddie', intelligence: 7, strength: 8, endurance: 10, spicyFoodTolerance: 3 },
    { id: '2', name: 'Will', intelligence: 9, strength: 8, endurance: 7, spicyFoodTolerance: 9 },
    { id: '3', name: 'Mike', intelligence: 9, strength: 5, endurance: 7, spicyFoodTolerance: 5 },
  ]

  // current applicants seed data
  applicants = [
    { id: '4', name: 'Daniel', intelligence: 10, strength: 10, endurance: 10, spicyFoodTolerance: 10, compatibility: '0.72' },
    // { id: '5', name: 'Samus Metroid', intelligence: 5, strength: 7, endurance: 4, spicyFoodTolerance: 3, compatibility: '' },
  ]


  /**
   * edit this team member
   * @param member 
   */
  onBeforeEdit(member) {
    this.addId = member.id
    this.addName = member.name
    this.addIntelligence = member.intelligence
    this.addStrength = member.strength
    this.addEndurance = member.endurance
    this.addSpicyFoodTolerance = member.spicyFoodTolerance
  }

  onBeforeAdd() {
    this.addId = '';
    this.addName = ''
    this.addIntelligence = 5
    this.addStrength = 5
    this.addEndurance = 5
    this.addSpicyFoodTolerance = 5
  }


  /**
   * Delete this member
   * @param member 
   */
  deleteMember(teamFlag, member) {
    // check if we are deleting to the team member table or the applicant table
    // later make this one table with a flag?????
    if (teamFlag) {
      _.remove(this.team, function(currentObject) {
        return currentObject.id === member.id;
      });
    } else {
      _.remove(this.applicants, function(currentObject) {
        return currentObject.id === member.id;
      });
    }

  }


  /**
   * Add a new team member or save an existing one
   */
  saveMember(teamFlag, memberId ? ) {
    // check if we are saving to the team member table or the applicant table
    // later make this one table with a flag?????
    if (teamFlag) {
      // if we are updating an existing member, then delete him since u will create him again
      if (memberId) {
        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(this.team, { id: memberId });
        // Replace item at index using native splice
        this.team.splice(index, 1, { id: memberId, name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance });
      }
      // if no id passed, then generate a new one and create a new entry
      else {
        this.team.push({ id: this.generateId(), name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance })
      }
    } else {
      // if we are updating an existing member, then delete him since u will create him again
      if (memberId) {
        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(this.applicants, { id: memberId });
        // Replace item at index using native splice
        let applicant = { id: this.generateId(), name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance, compatibility: '' }
        applicant.compatibility = this.getCompatibility(applicant, this.team)
        this.applicants.splice(index, 1, applicant);
      }
      // if no id passed, then generate a new one and create a new entry
      else {
        let applicant = { id: this.generateId(), name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance, compatibility: '' }
        applicant.compatibility = this.getCompatibility(applicant, this.team)
        this.applicants.push(applicant)
      }
    }

    // recalculate the compatibility of the applicants
    for (const applicant of this.applicants) {
      applicant.compatibility = this.getCompatibility(applicant, this.team)
    }
  }



  /**
   * Generate a unique 36 digit id
   */
  generateId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
  }



  /**
   * Get the compatibility score of the user to the average of the team
   * @param member 
   * @param team 
   */
  getCompatibility(member, team): string {
    let intelligence = _.meanBy(this.team, 'intelligence');;
    let strength = _.meanBy(this.team, 'strength');;
    let endurance = _.meanBy(this.team, 'endurance');;
    let spicyFoodTolerance = _.meanBy(this.team, 'spicyFoodTolerance');;

    let totalDifference =
      Math.abs(member.intelligence - intelligence) +
      Math.abs(member.strength - strength) +
      Math.abs(member.endurance - endurance) +
      Math.abs(member.spicyFoodTolerance - spicyFoodTolerance);

      // zero division causes errors
      if (totalDifference == 0) {
        return '1.00';
      }
      else {
        return  (1- (totalDifference / 40)).toFixed(2);
      }
  }


  getAttributeAverage(attribute) {
    let attributeTotal = _.sumBy(this.team, attribute)
    return (attributeTotal/this.team.length).toFixed(2);
   
  }
 


}
