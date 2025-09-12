# Test Task Scheduler - Backend

A Node.js/Express backend application that automatically generates boxes at scheduled intervals and sends email notifications when the task is completed.

## 🚀 Features

- **Automated Scheduler**: Generates boxes every 60 seconds
- **Exponential Growth**: Creates 2^(run-1) boxes per run
- **Email Notifications**: Sends email when 16+ boxes are generated
- **MongoDB Integration**: Stores box data with timestamps
- **RESTful API**: Provides endpoints for frontend integration
- **Real-time Stats**: Tracks total boxes, last run, and next run

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account with App Password enabled

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

4. **Configure your environment variables**
   Edit `.env` file with your actual values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/task-scheduler
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password-here
   EMAIL_RECIPIENT=Dawood.ahmed@collaborak.com
   SCHEDULER_INTERVAL=60000
   ```

## 📧 Email Configuration

### Getting Gmail App Password

1. **Enable 2-Factor Authentication** on your Google account
2. **Go to Google App Passwords**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. **Select App**: Choose "Mail" or "Other (Custom name)"
4. **Enter App Name**: e.g., "Task Scheduler"
5. **Copy Generated Password**: Use this 16-character password as `EMAIL_PASS`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/task-scheduler` |
| `PORT` | Server port | `5000` |
| `EMAIL_USER` | Your Gmail address | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `abcd efgh ijkl mnop` |
| `EMAIL_RECIPIENT` | Recipient email | `Dawood.ahmed@collaborak.com` |
| `SCHEDULER_INTERVAL` | Scheduler interval (ms) | `60000` |

## 🚀 Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Development mode** (with auto-restart)
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Boxes
- `GET /api/boxes` - Get all boxes
- `GET /api/boxes/colors` - Get all unique colors
- `GET /api/boxes/stats` - Get statistics (total boxes, last run, next run, email sent status)

### Admin
- `POST /api/admin/reset-scheduler` - Reset scheduler to run #1

## 🔧 Scheduler Logic

The scheduler runs every 60 seconds and follows this pattern:

| Run # | Boxes Created | Total Boxes |
|-------|---------------|-------------|
| 1     | 1             | 1           |
| 2     | 2             | 3           |
| 3     | 4             | 7           |
| 4     | 8             | 15          |
| 5     | 16            | 31          |

**Email Trigger**: When total boxes ≥ 16, an email is sent to the recipient.

## 📊 Database Schema

### Box Model
```javascript
{
  height: Number,      // Box height in pixels
  width: Number,       // Box width in pixels
  color: String,       // Box color (hex code)
  run: Number,         // Scheduler run number
  createdAt: Date,     // Creation timestamp
  updatedAt: Date      // Last update timestamp
}
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

2. **Email Sending Failed**
   - Verify Gmail App Password is correct
   - Ensure 2FA is enabled on Google account
   - Check `EMAIL_USER` and `EMAIL_PASS` in `.env`

3. **Scheduler Not Running**
   - Check server logs for errors
   - Verify database connection
   - Use reset endpoint: `POST /api/admin/reset-scheduler`

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=task-scheduler:*
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if available)

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use App Passwords instead of your main Gmail password
- Keep your MongoDB connection string secure
- Consider using environment-specific configurations

## 📚 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **nodemailer**: Email sending
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a test application for demonstrating automated task scheduling and email notifications.
