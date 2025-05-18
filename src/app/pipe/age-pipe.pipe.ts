import { Pipe, PipeTransform } from '@angular/core';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { format } from 'date-fns';

@Pipe({
  name: 'agePipe',
  standalone: false
})
export class AgePipePipe implements PipeTransform {


  transform(value: string): string {
    if (!value) return '';

    try {
      const birthDate = new Date(value);
      const today = new Date();

      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      const formattedDate = format(birthDate, 'MMM d, yyyy'); // short date format

      return `${years}y ${months}m ${days}d : ${formattedDate}`;
    } catch (err) {
      console.error("Invalid date:", err);
      return 'Invalid Date';
    }
  }
}
