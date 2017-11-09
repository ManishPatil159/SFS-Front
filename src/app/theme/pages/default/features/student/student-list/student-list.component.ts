import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { GlobalErrorHandler } from '../../../../../../_services/error-handler.service';
import { MessageService } from '../../../../../../_services/message.service';

import { StudentService } from '../../../_services/student.service';
import { CommonService } from '../../../_services/common.service';
import { Student } from "../../../_models/student";

@Component({
    selector: "app-student-list",
    templateUrl: "./student-list.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class StudentListComponent implements OnInit {
    studentList: Observable<Student[]>;
    total: number;         //Number Of records
    currentPos: number;    //Current Page
    perPage: number;       //Number of records to be displayed per page
    firstPageNumber: number;
    lastPage: number;
    currentPageNumber: number; //Stores Current Page Number
    url: string;           //Api url
    sortUrl: string;       //Sort Api Url
    pages: number;         //Number of pages in pagination
    arr: number[] = [];    //Array for Number of pages in pagination
    pageSize: any;         //10,20,30,50,100
    ascSortCol1: boolean;  //Sorting for Column1
    ascSortCol2: boolean;  //Sorting for Column2
    ascSortCol3: boolean;  //Sorting for Column3
    ascSortCol4: boolean;  //Sorting for Column4
    ascSortCol5: boolean;  //Sorting for Column5
    ascSortCol6: boolean;  //Sorting for Column6
    ascSortCol7: boolean;  //Sorting for Column7
    filterCol1: any;       //Filter1 values 
    filterCol2: any;       //Filter2 values 
    filterQuery: string;   //Filter1 Api Query 
    filterQuery2: string;  //Filter2 Api Query 
    searchQuery: string;   //Search Api Query 
    countQuery: string;    //Count number of records query
    filter1CountQuery: string;  //Count number of records for filter1CountQuery
    filter2CountQuery: string;  //Count number of records for filter2CountQuery
    searchCountQuery: string;
    longList: boolean;     //To show now records found message
    prePageEnable: boolean; //To disable/enable prev page button
    nextPageEnable: boolean; //To disable/enable prev page button
    boundry: number;
    boundryStart: number;
    boundryEnd: number;

    filterValue1: string; //HTML values
    filterValue2: string; //HTML values
    searchValue: string; //HTML values
    selectedPageSize: number; //HTML values

    classList: any;
    categoryList: any;

    myFile: any;
    constructor(private router: Router, private studentService: StudentService,
        private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService, private commonService: CommonService) {
    }

    ngOnInit() {
        this.pageSize = [];
        this.pageSize.push({ label: '5', value: 5 });
        this.pageSize.push({ label: '10', value: 10 });
        this.pageSize.push({ label: '20', value: 20 });
        this.pageSize.push({ label: '30', value: 30 });
        this.pageSize.push({ label: '50', value: 50 });
        this.pageSize.push({ label: '100', value: 100 });

        // this.filterCol1 = [];
        // this.filterCol1.push({ label: '--Select--', value: 'select' });
        // this.filterCol1.push({ label: 'Suyash', value: 'Suyash' });
        // this.filterCol1.push({ label: 'Nikhil', value: 'Nikhil' });

        // this.filterCol2 = [];
        // let val = this.studentService.getFilterList("?filter[fields][AcademicYear]=true&filter[fields][id]=true");
        // this.filterCol2.push({ label: '--Select--', value: 'select' });
        // val.subscribe((response) => {
        //     for (let key in response) {
        //         if (response.hasOwnProperty(key)) {
        //             this.filterCol2.push({ label: response[key].AcademicYear, value: response[key].AcademicYear });
        //         }
        //     }
        // });

        //Default variable initialization
        this.perPage = 5;
        this.currentPos = 0;
        this.url = '';
        this.sortUrl = '&filter[order]=id ASC';
        this.ascSortCol1 = true;
        this.ascSortCol2 = true;
        this.ascSortCol3 = true;
        this.ascSortCol4 = true;
        this.ascSortCol5 = true;
        this.ascSortCol6 = true;
        this.ascSortCol7 = true;
        this.filterQuery = '';
        this.filterQuery2 = '';
        this.searchQuery = '';
        this.countQuery = '?';
        this.filter1CountQuery = '';
        this.filter2CountQuery = '';
        this.lastPage = this.perPage;
        this.currentPageNumber = 1;
        this.firstPageNumber = 1;
        this.prePageEnable = false;
        this.nextPageEnable = true;
        this.boundry = 3;
        this.boundryStart = 1;
        this.boundryEnd = this.boundry;
        this.searchCountQuery = '';

        this.getDataCount('');

        //List of Classes
        this.filterCol1 = [];
        let val = this.commonService.getClass();
        this.filterCol1.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.filterCol1.push({ label: response[key].className, value: response[key].id });
                }
            }
        });

        //List of Categories
        this.filterCol2 = [];
        val = this.commonService.getCategory();
        this.filterCol2.push({ label: '--Select--', value: 'select' });
        val.subscribe((response) => {

            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    this.filterCol2.push({ label: response[key].categoryName, value: response[key].id });
                }
            }
        });

    }

    /*Pagination Function's Starts*/

    currentPageCheck(pageNumber) {
        if (this.currentPageNumber == pageNumber)
            return true;
        else
            return false;
    }
    generateCount() {
        this.arr = [];
        // for (var index = 0; index < this.pages; index++) {
        //     this.arr[index] = index + 1;
        // }
        //If number of pages are less than the boundry
        if (this.pages < this.boundry) {
            this.boundry = this.pages;
            this.boundryEnd = this.pages;
        } else {
            this.boundry = 3;
        }

        for (var index = 0, j = this.boundryStart; j <= this.boundryEnd; index++ , j++) {
            this.arr[index] = j;
        }

        //for()
    }
    moreNextPages() {
        if (this.boundryEnd + 1 <= this.pages) {
            this.boundryStart = this.boundryEnd + 1;
            this.currentPageNumber = this.boundryStart;
            if (this.boundryEnd + this.boundry >= this.pages) {
                this.boundryEnd = this.pages;
            } else {
                this.boundryEnd = this.boundryEnd + this.boundry;
            }
            this.getQueryDataCount();
        }
        //this.generateCount();


    }

    morePreviousPages() {
        if (this.boundryStart - this.boundry > 0) {
            this.boundryStart = this.boundryStart - this.boundry;
            this.boundryEnd = this.boundryStart + this.boundry - 1;
            this.currentPageNumber = this.boundryEnd;
            this.getQueryDataCount();
        }
    }

    pageSizeChanged(size) {
        this.perPage = size;
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
    }

    visitFirsPage() {
        if (this.boundryStart > this.boundry) {
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllStudents();
        }
    }

    visitLastPage() {
        for (var index = 0; this.currentPos + this.perPage < this.total; index++) {
            this.currentPos += this.perPage;
            this.currentPageNumber++;
        }
        this.boundryStart = 1;
        this.boundryEnd = this.boundry;
        for (var index = 0; this.boundryEnd + 1 <= this.pages; index++) {
            this.boundryStart = this.boundryEnd + 1;

            if (this.boundryEnd + this.boundry >= this.pages) {
                this.boundryEnd = this.pages;
                this.currentPageNumber = this.boundryEnd;
            } else {
                this.boundryEnd = this.boundryEnd + this.boundry;
                this.currentPageNumber = this.boundryEnd;
            }
        }
        //this.boundryEnd = this.pages;
        //this.boundryStart = this.pages - this.boundry + 1;

        this.generateCount();
        this.setDisplayPageNumberRange();
        this.getAllStudents();
    }

    backPage() {
        if (this.currentPos - this.perPage >= 0) {
            this.currentPos -= this.perPage;
            this.currentPageNumber--;

            // this.boundryStart--;
            // this.boundryEnd--;
            // this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllStudents();
        }
        else {
            this.currentPos = 0;
            this.currentPageNumber = 1;
        }
    }
    nextPage() {
        if (this.currentPos + this.perPage < this.total) {
            this.currentPos += this.perPage;
            this.currentPageNumber++;
            this.boundryStart++;
            // if (this.boundryStart > this.boundryEnd) {
            //     this.boundryStart--;
            //     this.moreNextPages();
            // }
            this.setDisplayPageNumberRange();
            this.getAllStudents();
        }
    }

    pageClick(pageNumber) {
        this.currentPos = this.perPage * (pageNumber - 1);
        this.currentPageNumber = pageNumber;
        this.setDisplayPageNumberRange();
        this.getAllStudents();
    }

    noPrevPage() {
        if (this.currentPos > 0) {
            return true;
        }
        return false;
    }

    setDisplayPageNumberRange() {
        this.currentPos = this.perPage * (this.currentPageNumber - 1);

        if ((this.currentPageNumber * this.perPage) > this.total)
            this.lastPage = this.total;
        else
            this.lastPage = this.currentPageNumber * this.perPage;

        if (this.lastPage >= this.total) {
            this.lastPage = this.total;
        }

        this.firstPageNumber = 1 + this.currentPos;
    }

    noFwrdPage() {
        if (this.currentPos + this.perPage < this.total) {
            return true;
        }
        return false;
    }

    /* Pagination Function's Ends */

    /* Filtering, Sorting, Search functions Starts*/
    searchString(searchString) {
        if (searchString == '') {
            this.searchQuery = '';
            this.searchCountQuery = '';
        } else {
            this.searchQuery = '&filter[where][SchoolName][ilike]=' + searchString;
            this.searchCountQuery = '&[where][SchoolName][like]=' + searchString;
        }
        this.getQueryDataCount();
        //this.getAllSchools();
    }

    filterByValue(column, value) {
        if (value == 'select') {
            this.filterQuery = '';
            this.filter1CountQuery = '';
        } else {
            this.filterQuery = '&filter[where][' + column + ']=' + value;
            this.filter1CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;

        this.getQueryDataCount();
    }

    filterByValue2(column, value) {
        if (value == 'select') {
            this.filterQuery2 = '';
            this.filter2CountQuery = '';
        } else {
            this.filterQuery2 = '&filter[where][' + column + ']=' + value;
            this.filter2CountQuery = '&where[' + column + '] =' + value;
        }
        this.currentPos = 0;
        this.currentPageNumber = 1;
        this.boundryStart = 1;
        this.boundry = 3;
        this.boundryEnd = this.boundry;
        this.getQueryDataCount();
    }

    sort(column, sortOrder) {
        if (sortOrder) {
            this.sortUrl = '&filter[order]=' + column + ' DESC';
        } else {
            this.sortUrl = '&filter[order]=' + column + ' ASC';
        }
        this.getAllStudents();
    }
    /* Filtering, Sorting, Search functions Ends*/

    /* Counting Number of records starts*/
    getQueryDataCount() {
        this.countQuery = '?' + this.filter1CountQuery + this.filter2CountQuery + this.searchCountQuery;
        this.getDataCount(this.countQuery);

    }
    getDataCount(url) {
        this.studentService.getStudentCount(url).subscribe((response) => {
            this.total = response.count;
            this.pages = Math.ceil(this.total / this.perPage);
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllStudents();
        },
        );
    }
    getUrl() {
        this.url = '?filter[include]=StudentClass&filter[include]=StudentCategory&filter[include]=StudentDivision&filter[limit]=' + this.perPage + '&filter[skip]=' + this.currentPos + this.filterQuery + this.filterQuery2 + this.sortUrl; //+ this.searchQuery;

    }
    /* Counting Number of records ends*/


    getAllStudents() {
        //this.studentList = this.studentService.getAllStudents();      
        this.getUrl();
        this.studentList = this.studentService.getAllStudents(this.url);
        this.studentList.subscribe((response) => {
            this.longList = response.length > 0 ? true : false;
        },
            error => {
                this.globalErrorHandler.handleError(error);
            }
        );
    }
    onAddStudent(fileInput: any) {
        let fd = new FormData();
        fd.append('csvdata', fileInput[0]);
        this.studentService.addStudents(fd).subscribe((response) => {
            this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Successfully Uploaded Students : ' + response.SavedStudents + ' <br/> Students Failed to Upload : ' + response.FailedStudents });
            this.currentPos = 0;
            this.currentPageNumber = 1;
            this.boundryStart = 1;
            this.boundryEnd = this.boundry;
            this.generateCount();
            this.setDisplayPageNumberRange();
            this.getAllStudents();
        },
            error => {
                this.globalErrorHandler.handleError(error);
            }
        );
    }

    onEditStudentClick(student: Student) {
        this.router.navigate(['/features/student/edit', student.id]);
    }
    onStudentDeleteClick(student: Student) {
        this.studentService.deleteStudent(student.id).subscribe(
            data => {
                this.messageService.addMessage({ severity: 'success', summary: 'Success', detail: 'Record Deleted Successfully' });
                if ((this.currentPageNumber - 1) * this.perPage == (this.total - 1)) {
                    this.currentPageNumber--;
                }
                this.getQueryDataCount();
            }, error => {
                this.globalErrorHandler.handleError(error);
            });
    }
}
