import shutil
import os
from datetime import datetime
import schedule
import time
import threading

class BackupManager:
    def __init__(self, db_path='instance/users.db', backup_dir='backups'):
        self.db_path = db_path
        self.backup_dir = backup_dir
        
        # Create backup directory if it doesn't exist
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
    
    def create_backup(self):
        """Create a backup of the database"""
        if not os.path.exists(self.db_path):
            print(f"❌ Database file not found: {self.db_path}")
            return False
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"users_backup_{timestamp}.db"
        backup_path = os.path.join(self.backup_dir, backup_filename)
        
        try:
            shutil.copy2(self.db_path, backup_path)
            print(f"✅ Backup created successfully: {backup_filename}")
            print(f"📁 Location: {backup_path}")
            return True
        except Exception as e:
            print(f"❌ Backup failed: {e}")
            return False
    
    def get_backups(self):
        """Get list of all backups"""
        if not os.path.exists(self.backup_dir):
            return []
        
        backups = []
        for file in sorted(os.listdir(self.backup_dir), reverse=True):
            if file.endswith('.db'):
                file_path = os.path.join(self.backup_dir, file)
                file_size = os.path.getsize(file_path) / 1024  # Size in KB
                file_time = os.path.getmtime(file_path)
                backups.append({
                    'filename': file,
                    'path': file_path,
                    'size': f"{round(file_size, 2)} KB",
                    'timestamp': datetime.fromtimestamp(file_time).strftime('%Y-%m-%d %H:%M:%S')
                })
        return backups
    
    def restore_backup(self, backup_filename):
        """Restore database from a backup"""
        backup_path = os.path.join(self.backup_dir, backup_filename)
        
        if not os.path.exists(backup_path):
            print(f"❌ Backup file not found: {backup_filename}")
            return False
        
        try:
            # Create a backup of current database before restoring
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            current_backup = os.path.join(self.backup_dir, f"users_pre_restore_{timestamp}.db")
            if os.path.exists(self.db_path):
                shutil.copy2(self.db_path, current_backup)
                print(f"📦 Current database saved: {current_backup}")
            
            # Restore the backup
            shutil.copy2(backup_path, self.db_path)
            print(f"✅ Database restored successfully from: {backup_filename}")
            return True
        except Exception as e:
            print(f"❌ Restoration failed: {e}")
            return False
    
    def cleanup_old_backups(self, keep_count=10):
        """Delete old backups, keeping only the most recent ones"""
        backups = self.get_backups()
        
        if len(backups) > keep_count:
            to_delete = backups[keep_count:]
            for backup in to_delete:
                try:
                    os.remove(backup['path'])
                    print(f"🗑️  Deleted old backup: {backup['filename']}")
                except Exception as e:
                    print(f"❌ Failed to delete {backup['filename']}: {e}")
    
    def schedule_backups(self, interval_hours=6):
        """Schedule automatic backups at regular intervals"""
        def run_scheduled_backup():
            while True:
                self.create_backup()
                self.cleanup_old_backups(keep_count=10)
                time.sleep(interval_hours * 3600)
        
        # Run backup scheduler in a separate thread
        backup_thread = threading.Thread(target=run_scheduled_backup, daemon=True)
        backup_thread.start()
        print(f"⏰ Backup scheduler started (every {interval_hours} hours)")


# Example usage
if __name__ == '__main__':
    backup_mgr = BackupManager()
    
    # Create a backup manually
    backup_mgr.create_backup()
    
    # List all backups
    print("\n📋 Available backups:")
    for backup in backup_mgr.get_backups():
        print(f"  - {backup['filename']} ({backup['size_kb']} KB) - {backup['created']}")
    
    # Clean up old backups
    backup_mgr.cleanup_old_backups(keep_count=10)
