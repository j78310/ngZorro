import {Component, OnInit} from '@angular/core';

import {NzMessageService} from 'ng-zorro-antd';

import {RandomUserService} from '../services/random-user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  _allChecked = false;
  _indeterminate = false;
  _displayData = [];
  editRow = null;
  tempEditObject = {};

  _current = 1;
  _pageSize = 10;
  _size = 'middle';
  _total = 1;
  _dataSet = [];
  _loading = true;
  _sortValue = null;
  _filterGender = [
    { name: 'male', value: false },
    { name: 'female', value: false }
  ];

  sort(value) {
    this._sortValue = value;
    this.refreshData();
  }

  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        data.checked = true;
      });
    } else {
      this._displayData.forEach(data => {
        data.checked = false;
      });
    }
    this._refreshStatus();
  }

  reset() {
    this._filterGender.forEach(item => {
      item.value = false;
    });
    this.refreshData(true);
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    const selectedGender = this._filterGender.filter(item => item.value).map(item => item.name);
    this._randomUser.getUsers(this._current, this._pageSize, 'name', this._sortValue, selectedGender).subscribe((data: any) => {
      this._loading = false;
      this._total = 200;
      this._dataSet = data.results;
    });
  }

  edit(data) {
    this.tempEditObject[ data.email ] = { ...data };
    this.editRow = data.email;
  }

  save(data) {
    Object.assign(data, this.tempEditObject[ data.email ]);
    this.editRow = null;
  }

  cancel(data) {
    this.tempEditObject[ data.email ] = {};
    this.editRow = null;
  }

  constructor(private _randomUser: RandomUserService, private message: NzMessageService) {}

  ngOnInit() {
    this.refreshData();
  }

}
