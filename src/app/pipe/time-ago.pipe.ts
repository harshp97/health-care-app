import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, format } from 'date-fns';


@Pipe({
  name: 'timeAgo',
  standalone: false
})

export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return ''; // Handle null or undefined values
    }

    try {
      const timeAgo = formatDistanceToNow(new Date(value), { addSuffix: true });
      const formattedDate = format(new Date(value), 'MMMM d, yyyy'); // e.g., May 10, 2024

      return `${timeAgo} : ${formattedDate}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date'; // Or handle the error as appropriate
    }
  }

}
