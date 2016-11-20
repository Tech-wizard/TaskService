interface Observer {
    onChange(task: Task): void;
}

class NPC extends egret.DisplayObjectContainer implements Observer {
    public _emoji: egret.Bitmap;
    public _body: egret.Bitmap;
    private id: string;
    public dialoguePanel: DialoguePanel;
    // public task:Task;
    constructor(id: string, ad: string, x: number, y: number, dp: DialoguePanel) {
        super();
        this._body = new egret.Bitmap();
        this._emoji = new egret.Bitmap();
        this.dialoguePanel = dp;
        this._body.texture = RES.getRes(ad);
       // this._emoji.texture = RES.getRes("notice_png");
        this.id = id;
        this.x = x;
        this.y = y;
        this._body.width = this._body.width / 3;
        this._body.height = this._body.height / 3;
        this._emoji.width = this._emoji.width / 5;
        this._emoji.height = this._emoji.height / 5;
        this._emoji.y = -100;
        this._emoji.alpha = 0;
        this.addChild(this._body);
        this.addChild(this._emoji);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNPCClick, this);

    }

    onChange(task: Task) {
        if (task.status == TaskStatus.ACCEPTABLE && this.id == task.fromNpcId) {
            //task.status = TaskStatus.DURING;
            this._emoji.texture = RES.getRes("notice_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this.id == task.fromNpcId) {
            //task.status = TaskStatus.;
            //this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 0;
        }
        if (task.status == TaskStatus.CAN_SUBMIT && this.id == task.toNpcId) {
            this._emoji.texture = RES.getRes("question_png");
            this._emoji.alpha = 1;
        }
        if (task.status == TaskStatus.SUBMITED && this.id == task.toNpcId) {
            this._emoji.alpha = 0;
        }
    }

    onNPCClick() {

        this.dialoguePanel.showDpanel();
        //TaskService.getInstance().notify(TaskService.getInstance().taskList["000"]);

    }
}

class TaskPanel extends egret.DisplayObjectContainer implements Observer {

    body: egret.Shape;
    textField: egret.TextField;
    textField2: egret.TextField;
    textField3: egret.TextField;
    //task:Task
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.body = new egret.Shape();
        this.body.graphics.beginFill(0x000000, 0.4);
        this.body.graphics.drawRect(0, 0, 600, 100);
        this.body.graphics.endFill();

        this.textField = new egret.TextField();
        this.textField.text = "   任务进程    ";
        this.textField.x = x;
        this.textField.x = y;

        this.textField2 = new egret.TextField();
        this.textField2.text = "   任务状态    ";
        this.textField2.x = x + 20;
        this.textField2.y = y + 30;

        this.textField3 = new egret.TextField();
        this.textField2.text = "   进度    ";
        this.textField3.x = x + 20;
        this.textField3.y = y + 55;
        this.addChild(this.body);
        this.addChild(this.textField);
        this.addChild(this.textField2);
        this.addChild(this.textField3);

    }

    onChange(task: Task): void {
        this.textField.text = task.desc;
        this.textField2.text = task.name + " :" + task.status.toString();
        this.textField3.text = task.name + " :" + task.getcurrent() + "/" + task.total;
    }

}


class DialoguePanel extends egret.DisplayObjectContainer {

    button: Button;
    textField: egret.TextField;
    body: egret.Shape;
    currentTask:Task;
    linkNPC:NPC;
    nextTask:Task;

    constructor(talk: string,linkNPC:NPC) {

        super();
        this.linkNPC = linkNPC;
        this.body = new egret.Shape();
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 600, 172);
        this.body.graphics.endFill();
        this.body.y = 450;
        this.textField = new egret.TextField();
        this.textField.text = talk;
        this.button = new Button("ok_png");
        this.textField.x = 80;
        this.textField.y = 500;
        this.button.width = 40;
        this.button.height = 40;
        this.button.x = 500;
        this.button.y = 550;
        this.button.touchEnabled = true;
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
       
    }

    showDpanel() {

        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);  
        this.updateViewByTask(TaskService.getInstance().getTaskByCustomRule());
        

    }

    public updateViewByTask(task:Task){
        this.currentTask = task;
        //this.textField.text = this.currentTask.desc;
    }

    disshowDpanel() {
        this.removeChild(this.body);
        this.removeChild(this.button);
        this.removeChild(this.textField);
        //this.alpha=0;
    }

    onButtonClick() {

        this.disshowDpanel();
        switch (this.currentTask.status) {
            case TaskStatus.ACCEPTABLE:

                TaskService.getInstance().accept(this.currentTask.id);

                break;
            case TaskStatus.CAN_SUBMIT:
                //console.log(TaskService.getInstance().finish("000"));
                TaskService.getInstance().finish(this.currentTask.id);
                TaskService.getInstance().taskList["001"].status = TaskStatus.ACCEPTABLE;
                TaskService.getInstance().notify(TaskService.getInstance().getTaskByCustomRule());

                break;
            default:
                break;

        }
        // TaskService.getInstance().notify(TaskService.getInstance().taskList["000"]);
    }
}

class Button extends egret.DisplayObjectContainer {
    body: egret.Bitmap;
    constructor(ad: string) {
        super();
        this.body = new egret.Bitmap();
        this.body.texture = RES.getRes(ad);
        this.addChild(this.body);
        this.touchEnabled = true;
    }
}

class MockKillMonsterButton extends Button implements Observer{
    public count = 0;
    constructor(ad: string) {
        super(ad);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
        egret.Ticker.getInstance().register(() => {

            if (this.count < 5) {
                this.body.scaleY*=1.05;
            }
            else if (this.count < 10 || this.count >= 5) {
                this.body.scaleY/=1.05;
            }
             this.count+=0.5;
            if (this.count >= 10) {
                this.count = 0;
            }

        }, this);
    }

    onButtonClick() {
        console.log('1111');
        //if (TaskService.getInstance().taskList["001"].status == TaskStatus.DURING) {
            TaskService.getInstance().taskList["001"].condition.onChange();
        //}
    }

    onChange(){

    }
}