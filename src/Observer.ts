interface Observer {
    onChange(task: Task): void;
}

class NPC extends egret.DisplayObjectContainer implements Observer {
    public _emoji: egret.Bitmap;
    public _body: egret.Bitmap;
    private id: string;
    public dialoguePanel:DialoguePanel;

    constructor(id: string, x: number, y: number) {
        super();
        this.id = id;
        this.x = x;
        this.y = y;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onNPCClick, this);
        this.dialoguePanel= new DialoguePanel();
    }

    public set emoji(emoji: egret.Bitmap) {
        this._emoji = emoji;
    }

    public set body(body: egret.Bitmap) {
        this._body = body;
    }

    onChange(task: Task) {
        task = TaskService.getInstance().getTaskByCustomRule();
        if (task.status == TaskStatus.UNACCEPTABLE && this.id == task.fromNpcId) {

            task.status = TaskStatus.ACCEPTABLE;
            this._emoji.texture = RES.getRes("notice_png");
        }
        if (task.status == TaskStatus.ACCEPTABLE && this.id == task.fromNpcId) {
            task.status = TaskStatus.DURING;
            //this._emoji.texture = RES.getRes("question_png");
            this.emoji.alpha = 0;
        }
        if (task.status == TaskStatus.ACCEPTABLE && this.id == task.toNpcId) {
            task.status = TaskStatus.DURING;
            this._emoji.texture = RES.getRes("question_png");

        }
        if (task.status == TaskStatus.DURING && this.id == task.toNpcId) {
            this._emoji.texture = RES.getRes("question_png");
        }
        if (task.status == TaskStatus.SUBMITED && this.id == task.toNpcId) {
            this._emoji.alpha = 0;
        }
    }

    onNPCClick() {
  if (this.id == TaskService.getInstance().taskList["000"].FromNpcId) {

    }
}
}

class TaskPanel extends egret.DisplayObjectContainer implements Observer {

    body: egret.Shape;
    textField: egret.TextField;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 300, 172);
        this.body.graphics.endFill();
        this.body.y = 33;
        this.textField.text = "       ";
        this.addChild(this.body);
        this.addChild(this.textField);

    }

    onChange(task: Task): void {
        this.textField.text = task.name + ":" + task.status.toString();
    }

}


class DialoguePanel extends egret.DisplayObjectContainer {

    button: Button;
    textField: egret.TextField;
    body: egret.Shape;
    constructor(task:Task) {
        super();
        this.body.graphics.beginFill(0x000000, 0.5);
        this.body.graphics.drawRect(0, 0, 300, 172);
        this.body.graphics.endFill();
        this.body.y = 600;
        this.textField.text =task.desc;
        this.button = new Button("button ok");
        this.button.touchEnabled = true;
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this.addChild(this.body);
        this.addChild(this.button);
        this.addChild(this.textField);
        this.alpha=0;
    }

    showDpanel(){
    this.alpha=1;
    }

    disshowDpanel(){
    this.alpha=0;
    }

   
    onButtonClick() {
     switch (TaskService.getInstance().taskList["000"].status) {
            case TaskStatus.ACCEPTABLE:
                TaskService.getInstance().accept(TaskService.getInstance().taskList["000"].Id);
                break;
            case TaskStatus.CAN_SUBMIT:
                TaskService.getInstance().finish(TaskService.getInstance().taskList["000"].Id);
                break;
            default:
               return
               
        }
    }
}

class Button extends egret.DisplayObjectContainer {
    body: egret.Bitmap;
    constructor(ad: string) {
        super();
        this.body.texture = RES.getRes(ad);
    }
}