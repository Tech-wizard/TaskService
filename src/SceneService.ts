class SceneService implements EventEmitter<number> {
    
private observerList: Observer<number>[] = [];
private static instance;
private static count = 0;
constructor() {
        SceneService.count++;
        if (SceneService.count > 1) {
            throw "singleton!!!";
        }
    }
    public static getInstance() {
        if (SceneService.instance == null) {
            SceneService.instance = new SceneService();
        }
        return SceneService.instance;
    }

     public addObserver(observer: Observer<number>) {
        for (var i = 0; i < this.observerList.length; i++) {
            if (observer == this.observerList[i])
                return ErrorCode.REPEAT_OBSERVER;
        }
        this.observerList.push(observer);
    }

     public notify(monsterId:number) {
      
        for (var observer of this.observerList) {
            observer.onChange(monsterId);
        }
    }
}