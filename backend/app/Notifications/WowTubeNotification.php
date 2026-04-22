<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WowTubeNotification extends Notification
{
    use Queueable;

    protected $message;
    protected $type;

    public function __construct($message, $type = 'info')
    {
        $this->message = $message;
        $this->type = $type;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => $this->message,
            'type' => $this->type,
        ];
    }
}
