import { Component, OnInit } from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

import { Subject } from 'rxjs';

import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarView,
} from 'angular-calendar';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { CustomDateFormatter } from './custom-date-formatter.provider';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  locale: string = 'es';

  constructor(private reservas: ReservaService) { }

  ngOnInit(): void {
    let todayDate = new Date().toISOString().slice(0, 10);
    this.reservas.setDay(todayDate)
  }

  dayClicked({ date }: any): void {
    let dayselected = date.toISOString().slice(0,10)
    this.reservas.setDay(dayselected)
  }

}
