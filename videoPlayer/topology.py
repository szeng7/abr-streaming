#!/usr/bin/env python

from mininet.cli import CLI
from mininet.net import Mininet
from mininet.link import TCLink
from mininet.topo import Topo
from mininet.log import setLogLevel
# from mininet.node import OVSController

class NetworkTopology(Topo):
    def __init__(self, **opts):
        Topo.__init__(self, **opts)
        h1 = self.addHost('h1')
        h2 = self.addHost('h2')
        h3 = self.addHost('h3')
        s1 = self.addSwitch('s1')
        self.addLink(h1, s1, bw=5, delay='10ms')
        self.addLink(h2, s1)
        self.addLink(h3, s1)
        
        
if __name__ == '__main__':
    setLogLevel( 'info' )
    topo = NetworkTopology()
    net = Mininet(topo=topo, link=TCLink, autoSetMacs=True,
           autoStaticArp=True)
    net.start()
    CLI( net )
    net.stop()