goog.provide('ZH.core.PageletProcessor');

goog.require('ZH.uti');
goog.require('ZH.core.Pagelet');
goog.require('goog.dom');
goog.require('goog.array');
goog.require('ZH.core.Registry');


/**
 * @constructor
 */
ZH.core.PageletProcessor = function(){
    
};

ZH.core.PageletProcessor.instance_ = null;

ZH.core.PageletProcessor.getInstance = function(){
    var instance_ = ZH.core.PageletProcessor.instance_;
    if(!instance_){
        instance_ = new ZH.core.PageletProcessor();
        ZH.core.PageletProcessor.instance_ = instance_;
    }
    return instance_;
};

ZH.core.PageletProcessor.prototype.parentsMap_ = null;

ZH.core.PageletProcessor.prototype.processPagelet = function(pagelet){
    var type_ = ZH.core.Registry.getInstance().getConstructor(pagelet.typeString);
    var instance_;
    
    if(pagelet.renderType === ZH.core.Pagelet.RenderType.UN_RENDER){
        instance_ = ZH.core.Registry.getInstance().getInstanceById(pagelet.typeString, pagelet.instanceIdentity);
        if(!instance_){
            //TODO: Throw exception? or write a log?
            return;
        }
        var p = instance_.getParent();
        if(p){
            p.removeChild(instance_, true);
        }else{
            instance_.exitDocument();
            if (instance_.element_) {
              goog.dom.removeNode(instance_.element_);
            }
        }
        return;
    }
    
    if(pagelet.renderType === ZH.core.Pagelet.RenderType.UPDATING){
        //Identity is unique, although no need to pass type string but for instance management, store
        //all instances of one type under a key is signeficantly.
        instance_ = ZH.core.Registry.getInstance().getInstanceById(pagelet.typeString, pagelet.instanceIdentity);
        if(instance_ && instance_.liveUpdate){
            instance_.liveUpdate(pagelet);
        }else{
            return;
        }
    }else{
        //Decoration mode.
        if(type_.createInstance){
            instance_ = type_.createInstance(pagelet.instanceIdentity);
        }else{
            /*jshint newcap:false */
            instance_ = new type_();
        }
    }

    //singleton component can create instance only once.
    //None singleton component should return old instance(if exists) or new instance.
    //We don't combinate instance get and create interface for singleton, case we needs 
    //set dom or markup on first creation, if instance management is done by Class it self, this can't be deal with.
    if(!instance_){
        return;
    }
    
    var referElement = (pagelet.referElement?goog.dom.getElement(pagelet.referElement):document.body);
    
    instance_.setIdentity(pagelet.instanceIdentity);
    //NOTE: Render mode is disabled.
    // if(pagelet.renderType == ZH.core.Pagelet.RenderType.RENDER){
    //     if(pagelet.renderPosition == ZH.core.Pagelet.RenderPosition.BEFORE){
    //         useParent = true;
    //         instance_.renderBefore(referElement);
    //     }else if(pagelet.renderPosition == ZH.core.Pagelet.RenderPosition.AFTER){
    //         useParent = true;
    //         instance_.renderAfter(referElement);
    //     }else{
    //         instance_.render(referElement);
    //     }
    //     //this.computeParent_(instance_, (useParent?referElement.parentNode:referElement));
    // }else
    
    var useParent = true;
    if(pagelet.renderType === ZH.core.Pagelet.RenderType.DECORATION){
        if(pagelet.renderPosition === ZH.core.Pagelet.RenderPosition.INNER){
            referElement.innerHTML = pagelet.markup;
            instance_.decorate(referElement);
        }else{
            var domElement = goog.dom.htmlToDocumentFragment(ZH.uti.trim(pagelet.markup));
            
            //IMPORTANAT: if this is not a element but documentFragment node.
            //Normally, any extra line break or comments outside 
            //elements html code should be stripped in template.
            if(domElement.nodeType !== 1 && domElement.childNodes){
                domElement = goog.array.find(domElement.childNodes, function(el){
                    //return firt element node.
                    return el.nodeType === 1;
                });
            }
            
            if(!domElement || domElement.nodeType !== 1){
                throw new Error('Dom creation fail.');
            }

            if(pagelet.renderPosition === ZH.core.Pagelet.RenderPosition.APPEND){
                goog.dom.appendChild(referElement, domElement);
                useParent = false;
            }else if(pagelet.renderPosition === ZH.core.Pagelet.RenderPosition.BEFORE){
                goog.dom.insertSiblingBefore(domElement, referElement);
            }else{
                //insert After.
                goog.dom.insertSiblingAfter(domElement, referElement);
            }
            instance_.decorate(domElement);
        }
        this.computeParent_(instance_, (useParent?referElement.parentNode:referElement));
    }else if(pagelet.renderType === ZH.core.Pagelet.RenderType.UPDATING){
        if(instance_.onLiveUpdating){
            instance_.onLiveUpdating(pagelet);
        }
    }
    
    return instance_;
};

//Walk up the dom tree to find ancestor parent.
ZH.core.PageletProcessor.prototype.computeParent_ = function(instance, referElement){
    while(referElement){
        if(referElement.getAttribute){
            var id_ = referElement.id, clientType = referElement.getAttribute('data-ct');
            if(id_ && clientType){
                //typeString, instanceId
                var p = ZH.core.Registry.getInstance().getInstanceById(clientType, id_);
                if(p){
                    p.addChild(instance);
                    //found one parent, breakup the loop.
                    referElement = null;
                    break;
                }else{
                    throw new Error('Invalid parent.')
                }
            }else{
                referElement = referElement.parentNode;
            }
        }else{
            referElement = referElement.parentNode;
        }
    }
};

ZH.core.PageletProcessor.prototype.initComponent = function(info, opt_parent){
    //info: [typeString, clientId]
    var self = ZH.core.PageletProcessor.getInstance();
    var arr_ = info.split('-');
    var type_ = arr_[0], id_ = info;
    var element = goog.dom.getElement(id_);
    if(!element){
        throw new Error('Element not found, ensure node attribute is written.');
    }
    //TODO: Get type constructor from class register.
    var nodeConstructor = ZH.core.Registry.getInstance().getConstructor(type_);
    if(nodeConstructor){
        // var instance;
        // if(nodeConstructor.createInstance){
        //     instance = nodeConstructor.createInstance(id_);
        // }else{
        //     instance = new nodeConstructor();
        // }
        /*jshint newcap:false */
        var instance = nodeConstructor.createInstance?nodeConstructor.createInstance():new nodeConstructor();
        instance.setIdentity(id_);
        
        if(instance){
            
            instance.decorate(element);
            if(opt_parent){
                opt_parent.addChild(instance);
            }
            var childs = self.parentsMap_[id_];
            if(childs && childs.length){
                var len = childs.length;
                for(var i=0;i<len;i++){
                    /*jshint noarg:false */
                    arguments.callee(childs[i], instance);
                }
            }
        }
    }else{
        throw new Error('constructor not found.')
        //TODO: handle exception, undefined type or module not loaded.
    }
};

ZH.core.PageletProcessor.prototype.setParentsMap = function(parentsMap){
    this.parentsMap_ = parentsMap;
};

ZH.core.PageletProcessor.prototype.initComponents = function(rootNodes){
    goog.array.forEach(rootNodes, function(node){
        this.initComponent(node);
    }, this);
};




