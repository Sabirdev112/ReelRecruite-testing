// Pages/Notification.js
export class NotificationPage {
  constructor(page) {
    this.page = page;

    this.notificationButton = page.getByRole('button', { name: 'Notifications' });
    this.viewAllButton = page.getByText('View all', { exact: true });


    this.statusLabel = page.getByText('Status', { exact: true });
    this.readTab = page.getByRole('button', { name: 'Read', exact: true });
    this.unreadTab = page.getByRole('button', { name: 'Unread', exact: true });


    this.firstNotification = page.locator('[role="listitem"]').first();


    this.markAsReadButton = page
      .locator('button')
      .filter({ hasText: 'Mark as read' })
      .first();

    this.markAllReadButton = page.getByRole('button', {
      name: 'Mark All as Read',
      exact: true,
    });
  }


  async openNotifications() {
    await this.notificationButton.click();
  }

  async openViewAll() {
    await this.viewAllButton.waitFor({ state: 'visible' });
    await this.viewAllButton.click();
  }

  async checkStatusTabs() {
    await this.statusLabel.waitFor({ state: 'visible' });

    await this.readTab.click();
    await this.unreadTab.click();
  }


  async markFirstNotificationAsReadIfExists() {
    if (await this.firstNotification.count() === 0) {
      console.log('No notifications available');
      return;
    }

    await this.firstNotification.click();

    // Safely check without waiting forever
    if (await this.markAsReadButton.isVisible()) {
      await this.markAsReadButton.click();
      console.log('First notification marked as read');
    } else {
      console.log('Mark as read button not visible');
    }
  }

  async markAllAsReadIfExists() {
    if (await this.markAllReadButton.isVisible()) {
      await this.markAllReadButton.click();
      console.log('All notifications marked as read');
    } else {
      console.log('No notifications to mark as read');
    }
  }

  async handleNotificationsFlow() {
    await this.openNotifications();
    await this.openViewAll();

    await this.checkStatusTabs();
    await this.markFirstNotificationAsReadIfExists();
    await this.markAllAsReadIfExists();
  }
}

export default NotificationPage;
