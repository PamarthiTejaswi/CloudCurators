import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications.subscribe(notifs => {
      this.notifications = notifs;
    });
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'OK';
      case 'error':
        return 'X';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      default:
        return '-';
    }
  }
}


