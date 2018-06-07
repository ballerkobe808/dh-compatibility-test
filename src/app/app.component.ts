import { Component, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  // temporary fields to manipulate the user records
  // change this to editId, editName, etc later
  addId: string = 'NEW';
  addName: string = '';
  addIntelligence: number = 5;
  addStrength: number = 5;
  addEndurance: number = 5;
  addSpicyFoodTolerance: number = 5;
  currentMember: any;
  modalTitle: string = ''

  teamFlag: boolean = false;
  invalidFile: boolean = false;
  jsonLink: string = '';
  @ViewChild('addSwal') addSwal: SwalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;

  // current team seed data
  team = [
    // { id: '1', name: 'Eddie', intelligence: 7, strength: 8, endurance: 10, spicyFoodTolerance: 3 },
    // { id: '2', name: 'Will', intelligence: 9, strength: 8, endurance: 7, spicyFoodTolerance: 9 },
    // { id: '3', name: 'Mike', intelligence: 9, strength: 5, endurance: 7, spicyFoodTolerance: 5 },
  ]

  // current applicants seed data
  applicants = [
    // { id: '4', name: 'Daniel', intelligence: 10, strength: 10, endurance: 10, spicyFoodTolerance: 10, compatibility: '0.72' },
  ]


  /**
   * edit this team member
   * @param member 
   */
  editMember(teamFlag, member) {
    // grab the member passed and use this in the modal
    this.addId = member.id
    this.addName = member.name
    this.addIntelligence = member.intelligence
    this.addStrength = member.strength
    this.addEndurance = member.endurance
    this.addSpicyFoodTolerance = member.spicyFoodTolerance

    this.teamFlag = teamFlag;
    this.modalTitle = (teamFlag) ? 'Edit Team Member' : 'Edit Applicant';

    // show the modal
    this.addSwal.show();

    // the input may not be there right away, so stall to make sure it is
    setTimeout(function() {
      document.getElementById("addName").focus();
    }, 200);
  }

  /**
   * Set default user to add
   */
  addMember(teamFlag) {
    // create a new user using these defaults when adding a new user
    this.addId = 'NEW';
    this.addName = ''
    this.addIntelligence = 5
    this.addStrength = 5
    this.addEndurance = 5
    this.addSpicyFoodTolerance = 5

    this.teamFlag = teamFlag;
    this.modalTitle = (teamFlag) ? 'Add Team Member' : 'Add Applicant';

    // show the modal
    this.addSwal.show();
    // the input may not be there right away, so stall to make sure it is
    setTimeout(function() {
      document.getElementById("addName").focus();
    }, 200);
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

    this.calculateCompatibility();
  }


  /**
   * Add a new team member or save an existing one
   */
  saveMember(teamFlag) {
    // check if we are saving to the team member table or the applicant table
    // later make this one table with a flag?????
    if (teamFlag) {
      // check if we are updating an existing member or adding a new one
      if (this.addId != 'NEW') {
        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(this.team, { id: this.addId });
        // Replace item at index using native splice
        this.team.splice(index, 1, { id: this.addId, name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance });
      }
      // if no id passed, then generate a new one and create a new entry
      else {
        this.team.push({ id: this.generateId(), name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance })
      }
    } else {
      // check if we are updating an existing member or adding a new one
      if (this.addId != 'NEW') {
        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(this.applicants, { id: this.addId });
        // Replace item at index using native splice
        let applicant = { id: this.generateId(), name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance, compatibility: '' }
        // applicant.compatibility = this.getCompatibility(applicant, this.team)
        this.applicants.splice(index, 1, applicant);
      }
      // if no id passed, then generate a new one and create a new entry
      else {
        let applicant = { id: this.generateId(), name: this.addName, intelligence: this.addIntelligence, strength: this.addStrength, endurance: this.addEndurance, spicyFoodTolerance: this.addSpicyFoodTolerance, compatibility: '' }
        // applicant.compatibility = this.getCompatibility(applicant, this.team)
        this.applicants.push(applicant)
      }
    }


    // recalculate the comp score every time a save is made
    this.calculateCompatibility();
  }


  /**
   * Calculate the compatibility of all the applicants. This happens when any team member is
   * updated/added/deleted
   */
  calculateCompatibility() {
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

    // if no team it will be nan
    if (isNaN(totalDifference)) {
      return '-';
    }
    // zero division causes errors
    // else if (totalDifference == 0) {
    //   return '1.00';
    // } else {
      return (1 - (totalDifference / 40)).toFixed(2);
    // }
  }


  getAttributeAverage(attribute) {
    let attributeTotal = _.sumBy(this.team, attribute)
    let average = (attributeTotal / this.team.length).toFixed(2);

    // check that u got a number (case where no team members)
    return isNaN(parseFloat(average)) ? '' : average;
  }



  /**
   * Save the results from the server as a txt file
   */
  downloadJson() {
    var theJSON = JSON.stringify(this.applicants);

    var blob = new Blob([theJSON], { type: 'text/csv' });
    saveAs(blob, "applicants.txt");
  }

  /**
   * Load a team using a json file.
   * This requires a specific format, will add error checking later
   * 
   * @param event 
   */
  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      reader.readAsText(file);
      reader.onload = () => {
        console.log(file)
        console.log(reader.result)

        // try parse the json - if its invalid throw an error

        try {
          let json = JSON.parse(reader.result);
          this.invalidFile = false;

          // check for team json and add it here
          if (json.team) {
            let team = json.team;
            // give them unique ids
            for (const member of team) {
              member.id = this.generateId();
            }
            this.team = this.team.concat(team);
          }

          // check for applicant json and add them here
          if (json.applicants) {
            let applicants = json.applicants;
            // give them unique ids
            for (const member of applicants) {
              member.id = this.generateId();
            }
            this.applicants = this.applicants.concat(applicants);
          }

          // clear the file after finishing
          // otherwise if the user picks the same file, nothing happens
          this.fileInput.nativeElement.value = '';

          // recalculate the comp score every time a file is added
          this.calculateCompatibility();

        } catch (e) {
          this.invalidFile = true;
          console.log(e)
        }

      };
    }
  }
}
